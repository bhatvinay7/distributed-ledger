import express,{Router} from "express"
const router:Router =express.Router()
import {payAmount} from "../controllers/pay.js"
import fetchUserPaymentHistory from "../controllers/user-history.js"
router.get("/fetchPaymentHistory",fetchUserPaymentHistory as any)
router.post("/pay",payAmount as any)
export default router