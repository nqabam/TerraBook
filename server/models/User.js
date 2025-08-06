import mongoose from "mongoose"


const favoriteSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ["Accommodation", "VeganBusiness"], required: true }
});

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    username: {type: String, required: true, trim: true},
    passwordHash: { type: String, required: true },
    role: {type: String, enum: ["traveler", "owner", "admin"], default: "traveler" },
    image: {type: String },
    bio: { type: String, maxlength: 500 },
    favorites: [favoriteSchema]
}, {
    timestamps: true 
});

export default mongoose.model("User", userSchema);