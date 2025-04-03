
import asyncHandler from "../middlewares/asyncHandler.js";
import UserModle from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import sendEmail from "../utils/sendEmail.js";
import VerificationToken from "../models/verificationToken.js";





const createUser = asyncHandler(async(req , res)=>{
 const {username,email,password} = req.body;

 if(!username || !email || !password){
     res.status(400)
     throw new Error("All fields are required")
 }
 const userExist = await UserModle.findOne({email})
 if(userExist){
     res.status(400)
     throw new Error("User already exist")
 }
 const salt = await bcrypt.genSalt(10)
 const hashedPassword = await bcrypt.hash(password,salt)
 
 const token =Math.floor(100000 + Math.random()* 900000).toString()
 const user = await UserModle.create({
     username,
     email,
     password:hashedPassword,
 })

 

 if (email === process.env.GMAIL_USER) {
    user.isAdmin = true;
    await user.save();
    
 }
 
 await VerificationToken.create({
     userId: user._id,
     token,
     expiresAt: Date.now() + 5 * 60* 1000,
 });
 if(user){
    res.status(200).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        isVerified:user.isVerified,
        isAdmin:user.isAdmin,
    })
     
     const message=`
     <h1>Hello ${username}</h1>
     <p>Thank you for registering on our site</p>
     <p>your Verification pass is ${token}</p>`
     
     await sendEmail({
         to:email,
         subject:"Email verification",
         text:"Please verify your email",
         html:message})
         
         
}else{
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' });
    }
    
 
})

const verifyEmail = asyncHandler(async(req,res)=>{
    
    try {
        const { email,token } = req.body;
        
        // Validate input
        if (!email || !token) {
            res.status(400);
            throw new Error("Email and verification token are required");
        }
        const user = await UserModle.findOne({
            email,
        });
        
        if (!user) {
            res.status(400);
            throw new Error("Invalid token ");
        }        
    
        const verificationToken = await VerificationToken.findOne({
            userId: user._id,
            token,
        })
    
    
        if (!verificationToken) {
            res.status(400);
            throw new Error("Invalid token or token expired");
        }
        
            
        generateToken(res,user._id)
        user.isVerified = true;
        await user.save();
        console.log("User verified");
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
        });
        
        
    } catch (error) {
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' });
        
    }
}
)   

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are required")
    }
    const user = await UserModle.findOne({email})
    if(!user){
        res.status(400)
        throw new Error("Invalid email")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        res.status(400)
        throw new Error("Invalid password")
    }
    generateToken(res,user._id)
    res.json({
        _id:user._id,
        username:user.username,
        email:user.email,
        isVerified:user.isVerified,
        isAdmin:user.isAdmin,
    })
    try {
        
    } catch (error) {
        console.error(error)
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' });
    }
}
)

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{httpOnly:true,expires:new Date(0)})
    res.status(200).json({message:"User logged out"})
})
 
const getUsers = asyncHandler(async(req,res)=>{
    try {
        
        const users = await UserModle.find({}).select("-password")
        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' }); 
    }
}
)

const getUser = asyncHandler(async(req,res)=>{
    try {
        
        const user = await UserModle.findById(req.user._id)
        if(!user){
            res.status(400)
            throw new Error("User not found")
        }
        res.status(200).json({
            _id:user._id,
            username:user.username,
            email: user.email,
            isVerified:user.isVerified
        })
        
    } catch (error) {
        console.error(error)
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' });   
        
    }
})

const updateUser = asyncHandler(async(req,res)=>{
    const {username,password} = req.body;
    const user = await UserModle.findById(req.user._id);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
        
    }
    user.username = username || user.username;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
    const updateUser = await user.save();
    res.status(200).json({
        _id: updateUser._id,
        username: updateUser.username,
        email: updateUser.email,
        isVerified:updateUser.isVerified,
        isAdmin: updateUser.isAdmin,
    });

})

const ResendToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    const user = await UserModle.findOne({email});

    if (!user) {
        res.status(401)
        throw new Error("user not created");
    }
    try {
        
            const token =Math.floor(100000 + Math.random()* 900000).toString()
            await VerificationToken.deleteMany({ userId: user._id });
            await VerificationToken.create({
                userId: user._id,
                token,
                expiresAt: Date.now() + 5 * 60* 1000,
            });
            const message=`
        <h1>Hello ${user.username}</h1>
        <p>Thank you for registering on our site</p>
        <p>your Verification pass is ${token}</p>`
        
        await sendEmail({
            to:user.email,
            subject:"Email verification",
            text:"Please verify your email",
            html:message})

         res.json({ message: "Verification token sent successfully" });

    } catch (error) {
        res
          .status(res.statusCode || 500)
          .json({ message: error.message || 'Server error' });
    }



})
export {
    createUser,
    verifyEmail,
    loginUser,
    logoutUser,
    getUsers,
    getUser,
    updateUser,
    ResendToken
}