import express, { Router } from "express";
import type { AuthRequestHandler } from "types";
import { payAmount } from "../controllers/pay.js";
import fetch_transaction_history from "../controllers/user-payment-history.js";
import { fetch_trasaction_detail } from "../controllers/fetchTransaction_detail.js";
import add_account from "../controllers/add_account.js";
import fetch_user_account_detail from "../controllers/fetch_account_details.js";
import fetch_user_accounts from "../controllers/fetch_all_accounts.js";
import update_primary_account from "../controllers/update_primary_account.js";

const router: Router = express.Router();

// AuthRequestHandler is compatible with Express's RequestHandler —
// no `as any` casts needed.
router.get("/fetch_transaction_history", fetch_transaction_history as AuthRequestHandler);
router.get("/fetch_user_account_detail", fetch_user_account_detail as AuthRequestHandler);
router.get("/fetch_user_accounts", fetch_user_accounts as AuthRequestHandler);
router.get("/transaction_detail", fetch_trasaction_detail as AuthRequestHandler);
router.patch("/update_primary_account", update_primary_account as AuthRequestHandler);
router.post("/pay", payAmount as AuthRequestHandler);
router.post("/add_account", add_account as AuthRequestHandler);

export default router;
