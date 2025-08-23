import Accommodation from "../models/Accommodation.js";
import MenuItem from "../models/MenuItem.js";
import { v2 as cloudinary } from 'cloudinary';

// API to create a new menu item
export const createMenuItem = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            preparationTime,
            ingredients,
            allergens, // This comes as a JSON string from frontend
            available,
            featured,
            spicyLevel
        } = req.body;

        // Find the accommodation for the current owner
        const accommodation = await Accommodation.findOne({ owner: req.auth.userId });

        if (!accommodation) {
            return res.status(404).json({ 
                success: false, 
                message: "No accommodation found for this owner" 
            });
        }

        // Parse allergens from JSON string to array
        let parsedAllergens = [];
        try {
            parsedAllergens = allergens ? JSON.parse(allergens) : [];
        } catch (error) {
            console.error("Error parsing allergens:", error);
            // If parsing fails, treat it as an empty array
            parsedAllergens = [];
        }

        // Handle image uploads if files are present
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path, { 
                    folder: "menu-items" 
                });
                return response.secure_url;
            });
            images = await Promise.all(uploadedImages);
        }

        // Create new menu item
        const menuItem = await MenuItem.create({
            accommodation: accommodation._id,
            name,
            description,
            price: parseFloat(price),
            category: category.toLowerCase(),
            preparationTime: preparationTime ? parseInt(preparationTime) : 0,
            ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
            allergens: parsedAllergens, // Use the parsed allergens
            available: available !== undefined ? available : true,
            featured: featured || false,
            spicyLevel: spicyLevel || 'none',
            images
        });

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            menuItem
        });

    } catch (error) {
        console.error("Menu item creation error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get all menu items for an accommodation
export const getMenuItems = async (req, res) => {
    try {
        const { accommodationId } = req.query;
        
        let query = { isAvailable: true };
        if (accommodationId) {
            query.accommodation = accommodationId;
        }

        const menuItems = await MenuItem.find(query)
            .populate('accommodation', 'businessName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            menuItems
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get menu items for the current owner's accommodation
export const getOwnerMenuItems = async (req, res) => {
    try {
        const accommodation = await Accommodation.findOne({ owner: req.auth.userId });

        if (!accommodation) {
            return res.status(404).json({
                success: false,
                message: "No accommodation found"
            });
        }

        const menuItems = await MenuItem.find({ accommodation: accommodation._id })
            .populate('accommodation', 'businessName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            menuItems
        });
    } catch (error) {
        console.error("Error fetching owner menu items:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to toggle menu item availability
export const toggleMenuItemAvailability = async (req, res) => {
    try {
        const { menuItemId } = req.body;
        
        const menuItem = await MenuItem.findById(menuItemId);
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        menuItem.available = !menuItem.available;
        await menuItem.save();

        res.json({
            success: true,
            message: "Menu item availability updated",
            available: menuItem.available
        });
    } catch (error) {
        console.error("Error toggling menu item availability:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to update a menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Parse allergens if they're provided as a JSON string
        if (updateData.allergens && typeof updateData.allergens === 'string') {
            try {
                updateData.allergens = JSON.parse(updateData.allergens);
            } catch (error) {
                console.error("Error parsing allergens in update:", error);
                // If parsing fails, keep the original value
            }
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.json({
            success: true,
            message: "Menu item updated successfully",
            menuItem
        });
    } catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to delete a menu item
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findByIdAndDelete(id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.json({
            success: true,
            message: "Menu item deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};