import mongoose from "mongoose";

const ecoReadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    category: { type: String },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String },
}, {
    timestamps: true
});

export default mongoose.model("EcoReads", ecoReadSchema);