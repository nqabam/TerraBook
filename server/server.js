import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebHooks.js";
import accommodationRouter from "./routes/accommodationRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

connectDB()
connectCloudinary()

const app = express()
app.use(cors()) //Enables Cross-Origin Resource Sharing

// MiddleWare
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to Clerk webhook
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send("API is Working"))
app.use('/api/use', userRouter)
app.use("/api/accommodations", accommodationRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));