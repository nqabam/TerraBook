import mongoose from "mongoose";

const veganBusinessSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["restaurant", "cafe"], required: true },
    location: {
        address: String,
        city: String,
        country: String,
        coordinates: { lat: Number, lng: Number }
    },
    website: String,
    contactNumber: String,
    images: [String],
    ecoCertifications: [String]
}, {
    timestamps: true
});

export default mongoose.model("VeganBusiness", veganBusinessSchema);