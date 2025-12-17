import { prisma,Prisma } from 'prisma'
export async function processTransaction(event: any) {
    const {
        transactionId,
        senderId,
        receiverId,
        receiverAccountId,
        senderAccountId,
        debit,
        credit,
        debitType,
        creditType,
        note,
        amount,
        createdAt
    } = event;

    return prisma.$transaction(async (tx) => {
        try {

            const [sender, receiver] = await Promise.all([
                tx.account.findUnique({ where: {id:senderAccountId, userId: senderId, } }),
                tx.account.findUnique({ where: {id:receiverAccountId, userId: receiverId } }),
            ]);

            if (!sender) throw new Error("Sender not found");
            if (!receiver) throw new Error("Receiver not found");

            const debitDecimal = new Prisma.Decimal(parseFloat(debit));
            const creditDecimal = new Prisma.Decimal(parseFloat(credit));

            const senderNewBalance = sender.balance.minus(debitDecimal);
            const receiverNewBalance = receiver.balance.plus(creditDecimal);

            const senderEntry = await tx.ledgerEntry.create({
                data: {
                    transactionId,
                    senderPrimaryAccountId: senderAccountId,
                    receiverPrimaryAccountId: receiverAccountId,
                    debit: debitDecimal,
                    credit: new Prisma.Decimal(0),
                    debitType:"Online",
                    creditType: "None",
                    balance: senderNewBalance,
                    note:`${debitDecimal} debited from your account`,
                    createdAt: createdAt ? new Date(createdAt) : new Date(),
                },
            });

            const receiverEntry = await tx.ledgerEntry.create({
                data: {
                    transactionId,
                    senderPrimaryAccountId: senderAccountId,
                    receiverPrimaryAccountId: receiverAccountId,
                    debit: new Prisma.Decimal(0),
                    credit: creditDecimal,
                    debitType: "None",
                    creditType:"Online",
                    balance: receiverNewBalance,
                    note:`${creditDecimal} is created to your account`,
                    createdAt: createdAt ? new Date(createdAt) : new Date(),
                },
            });

            await tx.journal.create({
                data: {
                    transactionId,
                    eventType: "TRANSACTION_CREATED",
                    timestamp:  createdAt ? createdAt: new Date(),
                    data: {
                        summary: `Transfer of ₹${amount} from ${senderId} to ${receiverId}`,
                        entries: [
                            {
                                type: "DEBIT",
                                accountId: senderAccountId,
                                message: `Account ${senderId} was debited ₹${amount}`,
                                amount: amount
                            },
                            {
                                type: "CREDIT",
                                accountId: receiverAccountId,
                                message: `Account ${receiverId} was credited ₹${amount}`,
                                amount: amount
                            }
                        ]
                    }
                },
            });

            await tx.auditLog.createMany({
                data: [
                    {
                        userId: senderId,
                        action: "DEBIT",
                        entity: "Account",
                        entityId: senderId,
                        previousValue: { balance: sender.balance.toString() },
                        newValue: { balance: senderNewBalance.toString() },
                    },
                    {
                        userId: receiverId,
                        action: "CREDIT",
                        entity: "Account",
                        entityId: receiverId,
                        previousValue: { balance: receiver.balance.toString() },
                        newValue: { balance: receiverNewBalance.toString() },
                    },
                ],
            });

            return { senderEntry, receiverEntry };
        }
        catch (error: any) {
            throw error
        }
    });
}