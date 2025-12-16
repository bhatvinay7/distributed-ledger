import { prisma, Prisma } from "prisma";
import { TransactionEvent} from "types";

export default async function processTransfer(event: TransactionEvent) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1) Idempotency check

    const existing = await tx.transaction.findUnique({
      where: { id: event.data.transactionId },
    });

    if (existing && existing.status === "SUCCESS") {
      return existing;
    }

    if (!existing) {
      await tx.transaction.create({
        data: {
          id: event.data.transactionId,
          senderId: event.data.senderId,
          receiverId: event.data.receiverId,
          senderPrimaryAccountId: event.data.senderPrimaryAccountId,
          receiverPrimaryAccountId: event.data.receiverPrimaryAccountId,
          amount: new Prisma.Decimal(event.data.debit),
          status: "PENDING",
          idempotencyKey: event.metadata.idempotencyKey,
        },
      });
    }

    // 2) Load sender
    const sender = await tx.account.findFirst({
      where: { userId: event.data.senderId },
    });
    if (!sender) throw new Error("Sender not found");

    const debitAmount = new Prisma.Decimal(event.data.debit);

    // 3) Balance check (Decimal-safe)
    if (sender.balance.lt(debitAmount)) {
      await tx.transaction.update({
        where: { id: event.data.transactionId },
        data: { status: "FAILED", updatedAt: new Date() },
      });
      throw new Error("Insufficient funds");
    }

    // 4) Load receiver
    const receiver = await tx.account.findFirst({
      where: { userId: event.data.receiverId },
    });
    if (!receiver) throw new Error("Receiver not found");

    // 5) Optimistic update sender
    const senderUpdate = await tx.account.updateMany({
      where: {
        userId: event.data.senderId,
        id: event.data.senderPrimaryAccountId,
        version: sender.version,
      },
      data: {
        balance: sender.balance.minus(debitAmount),
        version: { increment: 1 },
      },
    });

    if (senderUpdate.count === 0) {
      throw new Error("Optimistic lock failed for sender");
    }

    // 6) Optimistic update receiver
    const receiverUpdate = await tx.account.updateMany({
      where: {
        userId: event.data.receiverId,
        id: event.data.receiverPrimaryAccountId,
        version: receiver.version,
      },
      data: {
        balance: receiver.balance.plus(debitAmount),
        version: { increment: 1 },
      },
    });

    if (receiverUpdate.count === 0) {
      throw new Error("Optimistic lock failed for receiver");
    }

    // 7) Outbox (atomic)
    const outboxPayload = {
      transactionId: event.data.transactionId,
      senderId: event.data.senderId,
      receiverId: event.data.receiverId,
      senderAccountId: event.data.senderPrimaryAccountId,
      receiverAccountId: event.data.receiverPrimaryAccountId,
      debit: event.data.debit,
      credit: event.data.credit,
      debitType: event.data.debitType,
      creditType: event.data.creditType,
      note: event.data.note,
      amount: debitAmount.toString(),
      createdAt: new Date().toISOString(),
    };

    await tx.outbox.create({
      data: {
        transactionId: event.data.transactionId,
        correlationId: event.metadata.correlationId,
        causationId: event.metadata.causationId,
        senderId: event.data.senderId,
        receiverId: event.data.receiverId,
        payload: JSON.stringify(outboxPayload),
        status: "NEW",
        createdAt: new Date(),
        
      },
    });

    // 8) Mark SUCCESS
    await tx.transaction.update({
      where: { id: event.data.transactionId },
      data: { status: "SUCCESS" },
    });

    return { status: "SUCCESS" };
  });
}
