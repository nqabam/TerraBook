import mongoose from "momgoose";

const reviewRatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["Accommodation", "VeganBusiness"], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
}, {
    timestamps: true
});

export default mongoose.model("ReviewsRatings", reviewRatingSchema);