import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import path from "path"

// files

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


// configuration

dotenv.config()
connectDB()

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



const PORT = process.env.PORT || 6000

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes)

const _dirname = path.resolve();

app.use("/uploads",express.static(path.join(_dirname + "/uploads")))

app.listen(PORT,()=> console.log(`server is runing on port ${PORT}`));



