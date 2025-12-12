import express,{Router} from 'express';
import callbackHandler from '../controllers/authCallback.js';
import googleauth from '../controllers/googleauth.js';
const router:Router = express.Router();
router.get('/auth/googleAuth', googleauth);
router.get('/auth/callback/google',callbackHandler as any);

export default router;

