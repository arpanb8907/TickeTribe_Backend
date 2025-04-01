import express from "express"
import { register} from "../Controllers/auth";
const router = express.Router();


router.post("/user/register", (req,res)=>register(req,res));


router.post('/user/login', (req,res)=> login(req,res,));
