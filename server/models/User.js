import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    username: {type: String, required: true, trim: true},
    role: {type: String, enum: ["traveler", "owner", "admin"], default: "traveler" },
    image: {type: String },
    bio: { type: String, maxlength: 500 },
    favorites: [ {type: String, required: true}],
}, {
    timestamps: true 
});

export default mongoose.model("User", userSchema);