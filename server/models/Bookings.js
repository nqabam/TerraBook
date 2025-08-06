import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    travelerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accomodationId: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending"}
}, {
    timestamps: true
});

export default mongoose.model("Booking", bookingSchema);