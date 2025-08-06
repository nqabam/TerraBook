import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "VeganBusiness", required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    isAvailable: { type: Boolean, default: true }
}, { 
    timestamps: true 
})

export default mongoose.model("MenuItem", menuItemSchema);