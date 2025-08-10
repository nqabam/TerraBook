import Accommodation from "../models/Accommodation";
import Bookings from "../models/Bookings.js"
import Room from "../models/Room.js";


//Function to check room availability
const checkAvailability = async ({checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Bookings.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate},
        });
        const isAvailable = bookings.length === 0;
        return isAvailable
    } catch (error) {
        console.error(error.message);
    }
}

//API to check availability of room
// /api.bookings/check-availability
export const checkAvailabilityAPI = async (req, res)=>{
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({ success: true, isAvailable})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}

//API to create a new booking
//POST /api/bookings/book
export const createBooking = async (req, res)=>{
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Before Booking check availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if(!isAvailable){
            return res.json({ success: false, message: "Room is not available"})
        }

        //Get totalPrice from Room
        const roomData = await Room.findById(room).populate("accommodation");
        let totalPrice = roomData.pricePerNight;

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        const booking = await Bookings.create({
            user,
            room,
            Accommodation: roomData.accommodation._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.json({ success: true, message: "Booking created successfully"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed to create Booking"})
    }
};

//API to get all bookings for a user
// GET /api/bookings/user

export const getUserBookings = async (req, res) =>{
    try {
        const user = req.user._id;
        const bookings = await Bookings.find({user}).populate("room accommodation").sort({
            createdAt: -1
        })
        res.json({ success: true, bookings})
    } catch (error) {
        res.json({ success: false, messgae: "Failed to fetch bookings"});
    }
};

export const getHotelBookings = async (req, res) =>{
    try {
        const accommodation = await Accommodation.findOne({owner: req.auth().userId})
    if(!accomodation){
        return res.json({ success: true, message: "No Accomodation found"});
    }
    const bookings = await Bookings.find({accomodation: accommodation._id}).populate(" room accommodation user").sort({
        createdAt: -1
    });

    //total Bookings
    const totalBookings = bookings.length;
    //Total Revenue
    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0)

    res.json({ success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings"})
    }
};