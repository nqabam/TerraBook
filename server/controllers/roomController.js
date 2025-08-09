import Accommodation from "../models/Accommodation.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js"
// API to create a new room for a hotel
export const createRoom = async (req, res)=>{
    try {
        const {roomType, roomName, pricePerNight, amenities} = req.body;
        const accommodation = await accommodation.findOne({owner: req.auth().userId})

        if(!accommodation){
            return res.json({ success: false, message: "No Hotel found"});
        }

        //Upload images to cloudinary

        const uploadImages = req.files.map(async(file)=> {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        //WAIT for all uploads to complete
        const images = await Promise.all(uploadImages)

        await Room.create({
            accommodation: accommodation._id,
            roomName
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({success: true, message: Room created Successfully})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//API to get all rooms
export const getRooms = async (req, res)=>{

}

//API to get all rooms for a specific hotel
export const createRoom = async (req, res)=>{

}

//api to toggle availabiloity of a room
export const toggleRoomAvailability = async (req, res)=>{

}
