import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import accommodationRouter from "./routes/accommodationRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import menuItemRouter from "./routes/menuItemRoutes.js";

connectDB(); // Connect to MongoDB
connectCloudinary(); // Connect to Cloudinary

const app = express();
app.use(cors()); //Enable Cross-Origin Resource Sharing

//Middleware
app.use(express.json()); //Parse JSON bodies
app.use(clerkMiddleware());

//API to listen for Clerk webhooks
app.use("/api/clerk", clerkWebhooks)

app.get('/', (req, res) => res.send("API is running..."))
app.use('api/user', userRouter)
app.use('/api/accommodations', accommodationRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/menu-items', menuItemRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));