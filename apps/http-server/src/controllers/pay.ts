import { Request, Response } from "express";
import { prisma, Prisma } from "prisma";
import { v4 as uuid } from "uuid";
import getRedisClient from "redisclient";
import { client, jsonEvent } from "ledger";
import { AuthRequest, TransactionEvent } from "types";

export const payAmount = async (req: AuthRequest, res: Response) => {
  try {
    const redis = await getRedisClient();
    const user = req.user;
    const { receiverAccountId, amount, idempotencyKey } = req.body as {
      receiverAccountId: string;
      amount: string;
      idempotencyKey: string;
    };

    if (!user?.userId) {
      return res.status(400).json({ message: "User info is not available" });
    }

    const [sender_account_holder, receiver_account_holder] = await Promise.all([
      prisma.user.findUnique({ where: { id: user.userId }, select: { primaryAccountId: true } }),
      prisma.account.findUnique({ where: { id: receiverAccountId }, select: { id: true, userId: true } }),
    ]);

    if (!receiver_account_holder) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    if (!sender_account_holder?.primaryAccountId) {
      return res.status(400).json({ message: "Sender has no primary account" });
    }

    // Idempotency check via Redis
    const exists = await redis.get(`${user.userId}-${idempotencyKey}`);
    if (exists) {
      return res.status(409).json({ message: "Duplicate request" });
    }
    await redis.set(`${user.userId}-${idempotencyKey}`, "1", { EX: 86400 });

    const account = await prisma.account.findFirst({
      where: { userId: user.userId, id: sender_account_holder.primaryAccountId },
    });

    if (!account) {
      return res.status(400).json({ message: "No account found" });
    }

    const precisedAmount = new Prisma.Decimal(amount);

    if (account.balance.lt(precisedAmount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const tx = await prisma.transaction.create({
      data: {
        senderId: user.userId,
        receiverId: receiver_account_holder.userId,
        amount: precisedAmount,
        status: "PENDING",
        idempotencyKey,
        senderPrimaryAccountId: sender_account_holder.primaryAccountId,
        receiverPrimaryAccountId: receiver_account_holder.id,
      },
    });

    // Bug fix: import jsonEvent from 'ledger' (kurrentdb-client), NOT from '@eventstore/db-client'.
    // Mixing the two packages causes protobuf serialization errors since they use different wire formats.
    const event = jsonEvent<TransactionEvent>({
      type: "TRANSACTION_CREATED",
      data: {
        transactionId: tx.id,
        senderId: user.userId,
        receiverId: receiver_account_holder.userId,
        senderPrimaryAccountId: sender_account_holder.primaryAccountId,
        receiverPrimaryAccountId: receiver_account_holder.id,
        debit: Number(precisedAmount),
        credit: 0,
        debitType: "ONLINE",
        creditType: "NONE",
        balanceAfter: Number(account.balance),
        note: "debited",
        status: "PENDING",
      },
      metadata: {
        idempotencyKey,
        causationId: tx.id,
        correlationId: uuid(),
        source: "http-api",
        actorId: user.userId,
      },
    });

    try {
      // Bug fix: stream prefix must be "transactions-" (plural) to match
      // the transaction-worker's streamNameFilter({ prefixes: ["transactions-"] }).
      // Bug fix: removed invalid `deadline` option — not supported by kurrentdb-client.
      await client?.appendToStream(`transactions-${user.userId}`, event);

      return res.status(200).json({
        message: "Payment initiated",
        transactionId: tx.id,
        status: "PENDING",
      });
    } catch (error: unknown) {
      // Roll back idempotency key so the client can retry
      await redis.del(`${user.userId}-${idempotencyKey}`);
      return res.status(500).json({ message: "Failed to append event to stream", error: error.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
