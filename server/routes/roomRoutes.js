import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js"

const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 6), protect, createRoom)
roomRouter.get('/', getRooms)
roomRouter.get('/admin', protect, getOwnerRooms)
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability)

export default roomRouter;