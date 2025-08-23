import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    accommodation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accommodation',
        required: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['appetizers',
        'salads',
        'main course',
        'desserts',
        'beverages',
        'specials'
    ] },
    preparationTime: { type: Number, min: 0 }, // in minutes
    ingredients: [{ type: String }],
    allergens: [{ type: String, enum: ['nuts', 'dairy', 'gluten', 'eggs', 'shellfish', 'soy', 'fish']}], // common allergens
    featured: { type: Boolean, default: false },
    spicyLevel: { type: String, enum: ['none', 'mild', 'medium', 'hot', 'extreme'], default: 'none' },
    images: [{ type: String }], // URLs to images
    available: { type: Boolean, default: true },
}, { 
    timestamps: true 
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;