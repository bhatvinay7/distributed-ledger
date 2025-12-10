import {prisma} from "prisma"
import {NO_STREAM,client,jsonEvent} from "ledger"
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
          const receiverId = payload.receiverId;
          const amount = BigInt(payload.amount);

          await client?.appendToStream(`transactions-${senderId}`, [
             jsonEvent({
               type: "DEBIT",
               data:{
                 transactionId: txId,
                 userId: senderId,
                 amount: amount.toString(),
                 timestamp: new Date().toISOString(),
                }
               
              })
            ]
          );

          await client?.appendToStream(`transactions-${receiverId}`,[
            jsonEvent({
              type: "CREDIT",
              data:{
                transactionId: txId,
                userId: receiverId,
                amount: amount.toString(),
                timestamp: new Date().toISOString(),
              }})]
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
              lastError: String((innerErr as Error).message).slice(0, 1000),
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
