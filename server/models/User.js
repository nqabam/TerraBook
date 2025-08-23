import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, enum: ["user", "owner"], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;