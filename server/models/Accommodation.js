import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema({
    propertyType: { 
        type: String, 
        enum: ["hotel", "restaurant", "guesthouse", "resort", "cafe", "hostel"], 
        required: true 
    },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    owner: { type: String, ref: "User", required: true },
    website: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { 
        type: String, 
        enum: ["EC", "FS", "GP", "KZN", "NC", "NW", "WC"],
        required: true 
    },
    description: { type: String },
    amenities: [{ type: String }],
    certifications: [{ type: String }],
    termsAccepted: { type: Boolean, required: true },
    privacyAccepted: { type: Boolean, required: true },
    marketingAccepted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Accommodation = mongoose.model("Accommodation", accommodationSchema);

export default Accommodation;