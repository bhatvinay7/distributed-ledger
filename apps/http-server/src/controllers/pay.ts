import { Request, Response } from "express";
import { prisma,Prisma } from "prisma";
import { v4 as uuid } from "uuid";
import getRedisClient from "redisclient";
import {client}  from "ledger";
import {AuthRequest,TransactionEvent} from 'types'
import { jsonEvent,NO_STREAM ,ANY } from '@eventstore/db-client';
import  Decimal from "decimal.js"
export const payAmount = async (req:AuthRequest, res: Response) => {
  try {
    const redis = await getRedisClient();
    const user = req.user
    const { receiverAccountId, amount, idempotencyKey } = req.body as {
      receiverAccountId: string;
      amount: string;
      idempotencyKey: string;
    };
    if(!user?.userId){
        return res.status(400).json({message:"user info is not avalable"})
    }
    const sender_account_holder=await prisma.user.findUnique({where:{id:user.userId},select:{primaryAccountId:true}})
    const receiver_account_holder=await prisma.account.findUnique({where:{id:receiverAccountId},select:{id:true,userId:true}})
    if(!receiver_account_holder){
        return res.status(404).json({message:"account holder not found"})
    }
    const exists = await redis.get(`${user.userId}-${idempotencyKey}`);
    if (exists) {
      return res.status(409).json({ message: "Duplicate request" });
    }
    await redis.set(`${user.userId}-${idempotencyKey}`, "1", { EX: 30 })
     const account = await prisma.account.findFirst({
            where: { userId: user?.userId,id:sender_account_holder?.primaryAccountId! },
        });
    if (!account) {
   return res.status(400).json({ message: "No account found" });
 }
 const precisedAmount = new Prisma.Decimal(amount)
 
 if (account.balance.lt(precisedAmount)) {
   return res.status(400).json({ message: "Insufficient balance" });
 }
    const tx = await prisma.transaction.create({
      data: {
        senderId: user.userId,
        receiverId:receiver_account_holder.userId,
        amount:precisedAmount,
        status: 'PENDING',
        idempotencyKey,
        senderPrimaryAccountId: sender_account_holder?.primaryAccountId!,
        receiverPrimaryAccountId: receiver_account_holder?.id!,
      },
    });
    

const event = jsonEvent<TransactionEvent>({

  type: "TRANSACTION_CREATED",
  data: {
    transactionId: tx.id,
    senderId: user.userId,
    receiverId: receiver_account_holder.userId,
    senderPrimaryAccountId: sender_account_holder?.primaryAccountId ?? "",
    receiverPrimaryAccountId: receiver_account_holder?.id ?? "",
    debit: Number(precisedAmount),
    credit: 0,
    debitType: "ONLINE",
    creditType: "NONE",
    balanceAfter: Number(account.balance),
    note: "debited",
    status: "PENDING"
  },
  metadata: {
  idempotencyKey: idempotencyKey,
  causationId: tx.id,
  correlationId: uuid(),
  source: "http-api",
  actorId: user.userId
}
})
try{
console.log("Appending event to stream:", event);
   await client?.appendToStream(`transaction-${user.userId}`, event,{deadline: Date.now() + 5000});


    return res.status(200).json({
      message: "Payment initiated",
      transactionId: tx.id,
      status: "PENDING",
    });

}
catch(error:any){
  return res.status(500).json({message:"Failed to append event to stream",error:error.message})
}
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
