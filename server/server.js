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
import eventRouter from "./routes/eventRoutes.js";

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
app.use('/api/user', userRouter)
app.use('/api/accommodations', accommodationRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/menu-items', menuItemRouter)
app.use('/api/events', eventRouter)

//GEMINI API INTEGRATION
// server.js

require('dotenv').config();

const chatRoutes = require('./routes/chat');
const preferencesRoutes = require('./routes/preferences');
const itineraryRoutes = require('./routes/itinerary');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Health check with environment info
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      supabase: !!process.env.SUPABASE_URL,
      gemini: !!process.env.GEMINI_API_KEY
    }
  };
  res.json(healthInfo);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Terrabook Backend running on port ${PORT}`);
  console.log(`📊 Supabase: ${process.env.SUPABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Available' : 'Not configured'}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));