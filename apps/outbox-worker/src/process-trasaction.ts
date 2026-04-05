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
          const payload = JSON.parse(item.payload as string);
          const txId = payload.transactionId as string;
          const senderId = payload.senderId as string;
          const senderAccountId = payload.senderAccountId as string;
          const receiverAccountId = payload.receiverAccountId as string;
          const receiverId = payload.receiverId as string;
          // Bug fix: BigInt("100.50") throws SyntaxError for decimal amounts.
          // Keep amount as the original string — KurrentDB event data is JSON so strings are fine.
          const amount = payload.amount as string;
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
            data: { status: "SUCCESS", updatedAt: new Date() },
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
