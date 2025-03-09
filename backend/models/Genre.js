import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique:true
    }
}, { timestamps: true })


const genreModel = mongoose.model("Genre", genreSchema);


export default genreModel;

