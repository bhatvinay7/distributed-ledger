import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userCredentials,AuthRequest } from "types";
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.secret_key!;
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken= req.cookies?.inbox_token;
    if ((!authHeader || !authHeader.startsWith("Bearer")) && !cookieToken) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
    const token = authHeader?.split(" ")[1] || cookieToken;
    const decoded = jwt.verify(token!, JWT_SECRET) as userCredentials
    const user = {
      userId: decoded?.userId,
      username: decoded?.username,
      picture: decoded?.picture,
      token:token,
      email: decoded.email,
      isVerified: true,
    };
    req.user = user;

    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(403).json({ message: "Invalid token" });
  }
};
