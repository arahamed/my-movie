import mongoose from "mongoose";



const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type:Boolean,
        required:true, 
        default:false,

    }
},{ timestamps:true })


const UserModle = mongoose.model("User",userSchema)

export default UserModle;

