import jwt from "jsonwebtoken"
import User from "../models/user.js"


export const authCheck = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({success: false, message: "Invalid token or No token provided" })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        console.log(req.user);
        
        next();
      } catch (err) {
        console.error(err);
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      }
    };




export const globalMiddleware = (req, res, next) => {
    // res.json({ message: "General middleware activated!" })
    console.log("General middleware activated!");
    
    next();
    
}


