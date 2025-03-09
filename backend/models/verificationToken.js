
import mongoose from "mongoose";

const verificationTokenSchema = mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: "40s" },
    },
});

const VerificationToken = mongoose.model(
    "VerificationToken",
    verificationTokenSchema
);  

export default VerificationToken;