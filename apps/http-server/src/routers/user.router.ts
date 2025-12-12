import express,{Router} from 'express';
import getUserDetail from '../controllers/getuserInfo.js';
const router:Router= express.Router();
router.get('/getUserDetail', getUserDetail as any);

export default router;

