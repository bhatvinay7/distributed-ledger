import express,{Router} from "express"
const router:Router =express.Router()
import {payAmount} from "../controllers/pay.js"
import fetch_transaction_history from "../controllers/user-payment-history.js"
import {fetch_trasaction_detail} from "../controllers/fetchTransaction_detail.js"
import add_account from "../controllers/add_account.js"
import fetch_user_account_detail from "../controllers/fetch_account_details.js"
import fetch_user_accounts from "../controllers/fetch_all_accounts.js"
import update_primary_account from "../controllers/update_primary_account.js"
router.get("/fetch_transaction_history",fetch_transaction_history as any)
router.get("/fetch_user_account_detail",fetch_user_account_detail as any)
router.get("/fetch_user_accounts",fetch_user_accounts as any)
router.get("/transaction_detail",fetch_trasaction_detail as any)
router.patch("/update_primary_acount",update_primary_account as any)
router.post("/pay",payAmount as any)
router.post("/add_account",add_account as any)
export default router