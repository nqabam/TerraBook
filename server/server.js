import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebHooks.js";
import accommodationRoutes from "./routes/accommodationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

connectDB()

const app = express()
app.use(cors()) //Enables Cross-Origin Resource Sharing

// MiddleWare
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to Clerk webhook
app.use("/api/clerk", clerkWebhooks);

app.use("/api/accommodations", accommodationRoutes);
app.use("/api/user", userRoutes);

app.get('/', (req, res) => res.send("API is Working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));