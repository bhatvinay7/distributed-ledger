import {prisma} from 'prisma'
import {TransactionEventData} from 'types'
export default async function processTransfer(event:TransactionEventData) {

  return prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({
      where: { id: event.transactionId },
    });

    if (existing && existing.status == "SUCCESS") {
      return existing;
    }

  if (!existing) {
    await tx.transaction.create({
      data: {
        id: event.transactionId,
          senderId:event.senderId,
          receiverId:event.receiverId,
          amount: event.debit,
          status: 'PENDING',
          idempotencyKey : event.idEmpotencyKey
        },
      });
    }
    // 3) Read sender & receiver
    const sender = await tx.account.findFirst({ where: { userId: event.senderId }});
    if (!sender) throw new Error("Sender not found");
    if (BigInt(""+sender.balance) < BigInt(event.debit)) {
      // mark transaction failed and throw
      await tx.transaction.update({
        where: { id: event.transactionId },
        data: { status: "FAILED", updatedAt: new Date() },
      });
      throw new Error("Insufficient funds");
    }

    const receiver = await tx.account.findFirst({ where: { userId: event.receiverId }});
    if (!receiver) throw new Error("Receiver not found");

    // 4) Optimistic update sender: updateMany with version check
    const senderUpdate = await tx.account.updateMany({
      where: {
        userId: event.senderId,
        version: sender.version, // ensure version hasn't changed
      },
      data: {
        balance: (BigInt(""+sender.balance)*100n - BigInt(event.debit)*100n).toString().padStart(2, "0"),
        version: { increment: 1 },
      },
    });

    if (senderUpdate.count === 0) {
      // Optimistic lock failed for sender -> throw to rollback and caller can retry
      throw new Error("Optimistic lock failed for sender");
    }

    // 5) Optimistic update receiver
    const receiverUpdate = await tx.account.updateMany({
      where: {
        userId: event.receiverId,
        version: receiver.version,
      },
      data: {
        balance: (BigInt(""+receiver.balance)*100n + BigInt(event.debit)*100n).toString().padStart(2, "0"),
        version: { increment: 1 },
      },
    });

    if (receiverUpdate.count === 0) {
      // If receiver update fails, throw to rollback sender update as well
      throw new Error("Optimistic lock failed for receiver");
    }

    // 6) Write Outbox record (atomic with the updates above)
    const outboxPayload = {
      transactionId : event.transactionId,
      senderId: event.senderId,
      receiverId:event.receiverId,
      debit: event.debit,
      credit: event.credit,
      debitType:event.debitType,
      creditType :event.creditType,
      note :event.note,
      amount: event.debit.toString(),
      createdAt: new Date().toISOString(),
    };

    await tx.outbox.create({
      data: {
        transactionId:event.transactionId,
        senderId:event.receiverId,
        receiverId:event.senderId,
        payload: JSON.stringify(outboxPayload),
        status: "NEW",
        createdAt:new Date().toISOString()
      },
    });

    // 7) Mark transaction SUCCESS (still inside same DB TX)
    await tx.transaction.update({
      where: { id: event.transactionId },
      data: { status: 'SUCCESS' },
    });

    return { status: "SUCCESS" };
  }); // if any throw happens, entire transaction rolls back
}
