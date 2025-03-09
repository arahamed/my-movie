import UserModle from "../models/User.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";




const authenicate = asyncHandler(async(req,res,next)=>{
        const token = req.cookies.jwt;
        
        if (token) {
           try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            const user = await UserModle.findById(decoded.userId).select("-password")
            if(user.isVerified){
                req.user = user;
                next()
            }
            else{
                res.status(401).json({error:"Please verify your email"})
            }
            
           } catch (error) {
            res.status(500).json({error: `authorize token failed ${error.message}`})
           }
            
        }else{
            res.status(401).json({error:"Not authorized, no token"})
        }

})

const authorizeAdmin = asyncHandler(async(req,res,next)=>{
    if (req.user.isVerified && req.user.isAdmin) {
       next()
    }else{
       res.status(401).send("Not authorized as an admin.");
    }
})




export{
    authenicate,
    authorizeAdmin
}