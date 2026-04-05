import express, { Router } from "express";
import type { AuthRequestHandler } from "types";
import callbackHandler from "../controllers/authCallback.js";
import googleauth from "../controllers/googleauth.js";

const router: Router = express.Router();

router.get("/auth/googleAuth", googleauth);
router.get("/auth/callback/google", callbackHandler as AuthRequestHandler);

export default router;
