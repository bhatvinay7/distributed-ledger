import express,{Router} from 'express';
import getUserDetail from '../controllers/getuserInfo.js';
import update_user_profile from "../controllers/update_profile.js"
const router:Router= express.Router();
router.get('/getUserDetail', getUserDetail as any)
router.patch("/updatre_profile",update_user_profile as any)
export default router;

