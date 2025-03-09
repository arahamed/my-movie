import express from "express"
// controllers
import {
    createUser, 
    getUser, 
    getUsers, 
    loginUser, 
    logoutUser, 
    ResendToken, 
    updateUser, 
    verifyEmail 

} from "../controllers/userController.js";
import {
    authenicate, 
    authorizeAdmin
} from "../middlewares/authMiddleware.js";



const userRoutes = express.Router()

userRoutes.route("/").post(createUser).get(authenicate,authorizeAdmin,getUsers)
userRoutes.route("/verify").post(verifyEmail)
userRoutes.route("/resend").post(ResendToken)


userRoutes.route("/login").post(loginUser)
userRoutes.route("/logout").post(logoutUser)
userRoutes.route("/profile").get(authenicate,getUser).put(authenicate,updateUser)

export default userRoutes;