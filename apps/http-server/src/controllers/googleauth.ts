import { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config()
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const googleauth= async(req:Request,res:Response)=>{
 try{
   const base = "https://accounts.google.com/o/oauth2/v2/auth";
   const scope = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://mail.google.com/"
].join(" ");
   const url = `${base}?client_id=${encodeURIComponent(CLIENT_ID)}`
  + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  + `&response_type=code`
  + `&scope=${scope}`
  + `&access_type=offline`
  + `&prompt=consent select_account`;
  res.redirect(url);
     }
     catch(error:any){
        throw new Error(error.message)
     }
}
export default googleauth