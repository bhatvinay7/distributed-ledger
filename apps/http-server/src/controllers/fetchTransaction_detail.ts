import { Response } from "express";
import { prisma } from "prisma";
import {AuthRequest} from 'types'

export const fetch_trasaction_detail = async (req:AuthRequest, res: Response) => {
  try {
    const user = req.user
    const transactionId=req.query.transactionId as string
    if(!user?.userId){
        return res.status(400).json({message:"user info is not avalable"})
    }
    const trasactionDetail=await prisma.transaction.findFirst({where:{senderId:user.userId,
    id:transactionId
    }})
    if(!trasactionDetail){
     return   res.status(404).json({message:"trasaction detail not avalable"})
    }
    return res.status(200).json(trasactionDetail)
 }
 catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
