import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
   user: { type: String, ref: "User", required: true },
   room: { type: String, ref: "Room", required: true },
   Accommodation: { type: String, ref: "Accommodation", required: true },
   checkInDate: { type: Date, required: true },
   checkOutDate: { type: Date, required: true },
   totalPrice: { type: Number, required: true},
   guests: { type: Number, required: true },
   status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
   },
   paymenthMethod: {
    type: String,
    required: true,
    default: "Pay At hotel",
   },
   isPaid: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model("Booking", bookingSchema);