import { login, register } from '../controllers/auth.js';
import express from 'express';
import { authCheck } from '../middlewares/auth.js';

const router = express.Router();

router.post("/login",  login)
router.post("/register",  register)
router.get("/authCheck", authCheck, (req, res)=>{
    res.json({ success: true, message: "User authenticated successfullly!"})
});


export default router