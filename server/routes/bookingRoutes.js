import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Check availability of a room (no auth required)
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Create a booking (auth required)
bookingRouter.post("/book", protect, createBooking);

// Get all bookings for the logged-in user (auth required)
bookingRouter.get("/user", protect, getUserBookings);

// Get all bookings for accommodation owned by the logged-in owner (auth required)
bookingRouter.get("/accommodation", protect, getHotelBookings);

export default bookingRouter;
