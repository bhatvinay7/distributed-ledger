import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import getUserdata from "../utils/getUserdata.js";
import {AuthRequest } from 'types'
import getRedisClient from 'redisclient'
import {prisma,BankAccountType} from 'prisma'
import dotenv from 'dotenv'
dotenv.config()
import {SelectedUser} from 'types'
const SECRET_KEY = process.env.secret_key!;
const ACCESS_KEY= process.env.access_key!
const callbackHandler = async (req: AuthRequest, res: Response) => {
  try {
    const redis= await getRedisClient()
    const data:SelectedUser = await getUserdata(req, res)
    if (!data?.email) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    let user=    await prisma.user.findUnique({where:{ email: data.email }});
    if (!user) {
      user = await prisma.user.create({
       data:{
         username: data.name,
         email: data.email,
         isEmailVerified: true,
         picture: data.picture,
         refreshToken:data.refresh_token,
         accessToken: data.access_token,
         phone:""
       }   
        })
    }
    else{
      await prisma.user.update({
        where:{email:data.email},
        data:{
          accessToken:data.access_token,
          refreshToken:data.refresh_token,
        }
      })
    }
    const refreshToken = jwt.sign(
      {
        username: user.username,
        email: user.email!,
        userId: user.id,
        picture: data.picture,
        isVerified:true,
      },
      SECRET_KEY,
      { expiresIn: "24d" }
    );
    const acces_token = jwt.sign(
      {
        username: user.username,
        email: user.email!,
        userId: user.id,
        picture: data.picture,
        isVerified:true,
      },
      ACCESS_KEY ,
      { expiresIn: "7d" }
    );
    
    await redis.set(`${user.id}-access_token`,data.access_token) 
    await redis.set(`${user.id}-inbox-token`,data.refresh_token)
    res.cookie("payit_token", refreshToken , {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path:"/"
    });

    return res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL!}`);
  }
  
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("OAuth Error:", message);
    return res.status(500).json({ message: "OAuth error", error: message });
  }
};

export default callbackHandler;
