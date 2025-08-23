import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    accommodation: { type: String, ref: 'Accommodation', required: true },
    roomName: { type: String, required: true },
    roomType: { type: String, enum: ['Single', 'Double', 'Luxury', 'Suite'], required: true },
    pricePerNight: { type: Number, required: true },
    roomDescription: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);
export default Room;