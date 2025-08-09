import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    accommodation: { type: String, ref: "Accommodation", required: true },
    roomName: { type: String, required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    description: { type: String },
    amenities: { type: Array, required: true },
    images: [ { type: String }],
    isAvailable: { type: Boolean, default: true },
}, {
    timestamp: true
});

const Room = mongoose.model("Room", roomSchema);

export default Room;