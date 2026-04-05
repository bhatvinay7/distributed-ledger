import { prisma, Prisma } from "prisma";

// Shape of the payload published by the outbox-worker to the projection queue.
type OutboxPayload = {
  transactionId: string;
  senderId: string;
  receiverId: string;
  senderAccountId: string;
  receiverAccountId: string;
  debit: number | string;
  credit: number | string;
  debitType: string;
  creditType: string;
  note: string;
  amount: string;
  createdAt?: string;
};

export async function processTransaction(event: OutboxPayload): Promise<void> {
  const {
    transactionId,
    senderId,
    receiverId,
    receiverAccountId,
    senderAccountId,
    debit,
    credit,
    note,
    amount,
    createdAt,
  } = event;

  await prisma.$transaction(async (tx) => {
    const [sender, receiver] = await Promise.all([
      tx.account.findUnique({ where: { id: senderAccountId, userId: senderId } }),
      tx.account.findUnique({ where: { id: receiverAccountId, userId: receiverId } }),
    ]);

    if (!sender) throw new Error("Sender not found");
    if (!receiver) throw new Error("Receiver not found");

    const debitDecimal = new Prisma.Decimal(parseFloat(String(debit)));
    const creditDecimal = new Prisma.Decimal(parseFloat(String(credit)));

    const senderNewBalance = sender.balance.minus(debitDecimal);
    const receiverNewBalance = receiver.balance.plus(creditDecimal);

    const eventTimestamp = createdAt ? new Date(createdAt) : new Date();

    await tx.ledgerEntry.create({
      data: {
        transactionId,
        senderPrimaryAccountId: senderAccountId,
        receiverPrimaryAccountId: receiverAccountId,
        debit: debitDecimal,
        credit: new Prisma.Decimal(0),
        debitType: "Online",
        creditType: "None",
        balance: senderNewBalance,
        note: `${debitDecimal} debited from your account`,
        createdAt: eventTimestamp,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        transactionId,
        senderPrimaryAccountId: senderAccountId,
        receiverPrimaryAccountId: receiverAccountId,
        debit: new Prisma.Decimal(0),
        credit: creditDecimal,
        debitType: "None",
        creditType: "Online",
        balance: receiverNewBalance,
        note: `${creditDecimal} credited to your account`,
        createdAt: eventTimestamp,
      },
    });

    await tx.journal.create({
      data: {
        transactionId,
        eventType: "TRANSACTION_CREATED",
        timestamp: eventTimestamp,
        data: {
          summary: `Transfer of ₹${amount} from ${senderId} to ${receiverId}`,
          entries: [
            {
              type: "DEBIT",
              accountId: senderAccountId,
              message: `Account ${senderId} was debited ₹${amount}`,
              amount,
            },
            {
              type: "CREDIT",
              accountId: receiverAccountId,
              message: `Account ${receiverId} was credited ₹${amount}`,
              amount,
            },
          ],
        },
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          userId: senderId,
          action: "DEBIT",
          entity: "Account",
          entityId: senderAccountId,
          previousValue: { balance: sender.balance.toString() },
          newValue: { balance: senderNewBalance.toString() },
        },
        {
          userId: receiverId,
          action: "CREDIT",
          entity: "Account",
          entityId: receiverAccountId,
          previousValue: { balance: receiver.balance.toString() },
          newValue: { balance: receiverNewBalance.toString() },
        },
      ],
    });
  });
}
