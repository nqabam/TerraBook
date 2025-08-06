import momngoose from "mongoose";

const accommodationSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    location: {
        address: String,
        city: String,
        country: String,
        coordinates: { lat: Number, lng: Number }
    },
    amenities: [String],
    pricePerNight: { type: Number, required: true },
    availableFrom: Date,
    availableTo: Date,
    ecoCertifications: [String]
}, {
    timestamps: true
});

export default mongoose.model("Accommodation", accommodationSchema);