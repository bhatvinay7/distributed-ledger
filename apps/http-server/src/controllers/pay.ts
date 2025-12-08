import { Request, Response } from "express";
import { prisma } from "prisma";
import { v4 as uuid } from "uuid";
import getRedisClient from "redisclient";
import {client}  from "ledger";
import {AuthRequest,userCredentials,TransactionEventData} from 'types'
import { jsonEvent } from '@eventstore/db-client';

export const payAmount = async (req:AuthRequest, res: Response) => {
  try {
    const redis = await getRedisClient();
    const user = req.user
    const { receiverId, amount, idempotencyKey } = req.body;
    if(!user?.userId){
        return res.status(400).json({message:"user info is not avalable"})
    }
    const exists = await redis.get(`idem:${idempotencyKey}`);
    if (exists) {
      return res.status(409).json({ message: "Duplicate request" });
    }
    await redis.set(`idem:${idempotencyKey}`, "1", { EX: 30 })
     const account = await prisma.account.findFirst({
            where: { userId: user?.userId }
        });
    if (!account) {
   return res.status(400).json({ message: "No account found" });
 }
 if (account.balance < amount) {
   return res.status(400).json({ message: "Insufficient balance" });
 }
    const tx = await prisma.transaction.create({
      data: {
        senderId: user.userId,
        receiverId,
        amount,
        status: 'PENDING',
        idempotencyKey,
      },
    });
    

  const event=jsonEvent({
  id: uuid(),
  type: "TRANSACTION_CREATED",
  data: {
    transactionId: tx.id,
    accountId: account.id,
    debit: amount,
    credit: 0,
    debitType: "Online",
    creditType: "None",
    balance: account.balance,
    note: "debited",
    status: "PENDING",
    idEmpotencyKey :idempotencyKey ,
    timestamp: new Date().toISOString(),
  },
})
   await client?.appendToStream(`transaction-${user.userId}`, event,{
      streamState: "no_stream",
});


    return res.status(200).json({
      message: "Payment initiated",
      transactionId: tx.id,
      status: "PENDING",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
