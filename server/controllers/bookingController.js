import Accommodation from "../models/Accommodation.js";
import Booking from "../models/Bookings.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

// Function to check room availability
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room: new mongoose.Types.ObjectId(room),
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    return bookings.length === 0;
  } catch (error) {
    console.error("Error checking availability:", error.message);
    return false;
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    if (!room || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Before booking, check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("accommodation");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    await Booking.create({
      user,
      room,
      accommodation: roomData.accommodation._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate("room accommodation")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// API to get all bookings for a hotel's owner
// GET /api/bookings/accommodation
export const getHotelBookings = async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      owner: req.user._id,
    });

    if (!accommodation) {
      return res.json({
        success: true,
        message: "No accommodation found for this owner",
      });
    }

    const bookings = await Booking.find({
      accommodation: accommodation._id,
    })
      .populate("room accommodation user")
      .sort({ createdAt: -1 });

    // Total Bookings
    const totalBookings = bookings.length;

    // Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    console.error("Error fetching hotel bookings:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};
