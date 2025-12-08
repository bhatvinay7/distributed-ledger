import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function getData(req: Request, res: Response) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    throw new Error("Missing code parameter");
  }

  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const { access_token, refresh_token } = tokenResponse.data;

  // Fetch user profile
  const userResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  return {
    access_token,
    refresh_token,
    email: userResponse.data.email,
    name: userResponse.data.name,
    picture: userResponse.data.picture,
  };
}

export default getData;


