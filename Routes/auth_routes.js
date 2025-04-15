import express from "express"
import { authenticate, verify_otp} from "../Controllers/auth.js";
const router = express.Router();


router.post("/user/auth", (req,res)=>authenticate(req,res));


router.post('/user/login', (req,res)=> login(req,res,));
router.post('/verify-otp',(req,res)=> verify_otp(req,res));
export default router