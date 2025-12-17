import { prisma } from "prisma"
import { NO_STREAM, client, jsonEvent } from "ledger"
import pushMessageToqueue from "./publishToQueue.js";
const OUTBOX_BATCH = 20;

export async function startOutboxWorker() {
  while (true) {
    try {
      const items = await prisma.$transaction(async (tx) => {
        const rows = await tx.outbox.findMany({
          where: { status: "NEW" },
          orderBy: { createdAt: "asc" },
          take: OUTBOX_BATCH,
        });
        const ids = rows.map((r) => r.id);
        if (ids.length > 0) {
          await tx.outbox.updateMany({
            where: { id: { in: ids } },
            data: { status: "PROCESSING", attempts: { increment: 1 } },
          });
        }
        return rows;
      });

      if (items.length === 0) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      for (const item of items) {
        try {
          const payload = JSON.parse(item.payload as any);
          const txId = payload.transactionId;
          const senderId = payload.senderId;
          const senderAccountId = payload.senderAccountId;
          const receiverAccountId = payload.receiverAccountId;
          const receiverId = payload.receiverId;
          const amount = BigInt(payload.amount);
          const requestId = item.correlationId;
          const commandId = item.causationId;

          await client?.appendToStream(
            `transactions-${senderId}`,
            [
              jsonEvent({
                type: "DEBIT",
                data: {
                  transactionId: txId,
                  userId: senderId,
                  senderAccountId,
                  amount: amount.toString(),
                },
                metadata: {
                  requestId,
                  correlationId: requestId,
                  causationId: commandId,
                  direction: "DEBIT",
                  source: "http-api",
                },
              }),
            ]
          );

          await client?.appendToStream(
            `transactions-${receiverId}`,
            [
              jsonEvent({
                type: "CREDIT",
                data: {
                  transactionId: txId,
                  userId: receiverId,
                  receiverAccountId,
                  amount: amount.toString(),
                },
                metadata: {
                  requestId,                  // SAME as debit
                  correlationId: requestId,    // SAME as debit
                  causationId: commandId,      // SAME command
                  direction: "CREDIT",
                  source: "http-api",
                },
              }),
            ]
          );


          await prisma.outbox.update({
            where: { id: item.id },
            data: { status: "SUCCESS" },
          });

          await pushMessageToqueue(payload)

        } catch (innerErr) {
          await prisma.outbox.update({
            where: { id: item.id },
            data: {
              status: "FAILED",
              updatedAt: new Date(),
            },
          });
        }
      }
    } catch (err) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
