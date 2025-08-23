import Accommodation from "../models/Accommodation.js";
import { v2 as cloudinary } from 'cloudinary';
import Room from "../models/Room.js";

// API to create a new room for accommodation
export const createRoom = async (req, res) => {
    try {
        const {
            roomName, 
            roomType, 
            pricePerNight, 
            roomDescription, 
            amenities
        } = req.body;

        // Find the accommodation for the current owner
        const accommodation = await Accommodation.findOne({ owner: req.auth.userId });

        if (!accommodation) {
            return res.status(404).json({ 
                success: false, 
                message: "No accommodation found for this owner" 
            });
        }

        // Upload images to cloudinary
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(async (file) => {
                try {
                    const response = await cloudinary.uploader.upload(file.path, {
                        folder: "rooms",
                        transformation: [
                            { width: 800, height: 600, crop: "limit" },
                            { quality: "auto" }
                        ]
                    });
                    return response.secure_url;
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    throw new Error(`Failed to upload image: ${file.originalname}`);
                }
            });

            try {
                images = await Promise.all(uploadedImages);
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload some images"
                });
            }
        }

        // Parse amenities if it's a string
        let parsedAmenities = [];
        if (amenities) {
            if (typeof amenities === 'string') {
                try {
                    parsedAmenities = JSON.parse(amenities);
                } catch (parseError) {
                    // If it's not JSON, treat as comma-separated
                    parsedAmenities = amenities.split(',').map(a => a.trim()).filter(a => a);
                }
            } else if (Array.isArray(amenities)) {
                parsedAmenities = amenities;
            }
        }

        // Create new room
        const room = await Room.create({
            accommodation: accommodation._id,
            roomName: roomName.trim(),
            roomType,
            pricePerNight: parseFloat(pricePerNight),
            roomDescription: roomDescription.trim(),
            amenities: parsedAmenities,
            images,
            isAvailable: true
        });

        // Populate accommodation details for response
        await room.populate('accommodation', 'businessName propertyType');

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            room
        });

    } catch (error) {
        console.error("Room creation error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Room with this name already exists for this accommodation"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get all rooms (public endpoint)
export const getRooms = async (req, res) => {
    try {
        const { 
            accommodationId, 
            roomType, 
            minPrice, 
            maxPrice, 
            amenities,
            available 
        } = req.query;

        let query = {};

        // Filter by accommodation
        if (accommodationId) {
            query.accommodation = accommodationId;
        }

        // Filter by room type
        if (roomType && roomType !== 'all') {
            query.roomType = roomType;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
            if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
        }

        // Filter by amenities
        if (amenities) {
            const amenitiesArray = amenities.split(',').map(a => a.trim());
            query.amenities = { $all: amenitiesArray };
        }

        // Filter by availability
        if (available !== undefined) {
            query.isAvailable = available === 'true';
        } else {
            query.isAvailable = true; // Default to available rooms only
        }

        const rooms = await Room.find(query)
            .populate({
                path: 'accommodation',
                select: 'businessName propertyType address phone email images',
                populate: { 
                    path: 'owner',
                    select: 'firstName lastName image'
                }
            })
            .sort({ pricePerNight: 1, createdAt: -1 });

        res.json({
            success: true,
            rooms,
            totalCount: rooms.length
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get all rooms for a specific accommodation (owner only)
export const getOwnerRooms = async (req, res) => {
    try {
        // Find the accommodation for the current owner
        const accommodation = await Accommodation.findOne({ owner: req.auth.userId });

        if (!accommodation) {
            return res.status(404).json({
                success: false,
                message: "No accommodation found for this owner"
            });
        }

        const { available } = req.query;
        let query = { accommodation: accommodation._id };

        // Filter by availability if provided
        if (available !== undefined) {
            query.isAvailable = available === 'true';
        }

        const rooms = await Room.find(query)
            .populate('accommodation', 'businessName propertyType')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            rooms,
            totalCount: rooms.length
        });
    } catch (error) {
        console.error("Error fetching owner rooms:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        
        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        // Find the room and verify ownership
        const room = await Room.findById(roomId).populate('accommodation');
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Verify that the user owns the accommodation
        const accommodation = await Accommodation.findOne({ 
            _id: room.accommodation._id, 
            owner: req.auth.userId 
        });

        if (!accommodation) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to modify this room"
            });
        }

        room.isAvailable = !room.isAvailable;
        await room.save();

        res.json({
            success: true,
            message: "Room availability updated successfully",
            isAvailable: room.isAvailable
        });
    } catch (error) {
        console.error("Error toggling room availability:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to update a room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        // Find the room and verify ownership
        const room = await Room.findById(id).populate('accommodation');
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Verify that the user owns the accommodation
        const accommodation = await Accommodation.findOne({ 
            _id: room.accommodation._id, 
            owner: req.auth.userId 
        });

        if (!accommodation) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to modify this room"
            });
        }

        // Handle image uploads if new files are provided
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(async (file) => {
                try {
                    const response = await cloudinary.uploader.upload(file.path, {
                        folder: "rooms",
                        transformation: [
                            { width: 800, height: 600, crop: "limit" },
                            { quality: "auto" }
                        ]
                    });
                    return response.secure_url;
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    throw new Error(`Failed to upload image: ${file.originalname}`);
                }
            });

            try {
                const newImages = await Promise.all(uploadedImages);
                updateData.images = [...room.images, ...newImages];
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload some images"
                });
            }
        }

        // Parse amenities if provided as string
        if (updateData.amenities && typeof updateData.amenities === 'string') {
            try {
                updateData.amenities = JSON.parse(updateData.amenities);
            } catch (parseError) {
                updateData.amenities = updateData.amenities.split(',').map(a => a.trim()).filter(a => a);
            }
        }

        // Convert price to number if provided
        if (updateData.pricePerNight) {
            updateData.pricePerNight = parseFloat(updateData.pricePerNight);
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('accommodation', 'businessName propertyType');

        res.json({
            success: true,
            message: "Room updated successfully",
            room: updatedRoom
        });
    } catch (error) {
        console.error("Error updating room:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to delete a room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        // Find the room and verify ownership
        const room = await Room.findById(id).populate('accommodation');
        
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Verify that the user owns the accommodation
        const accommodation = await Accommodation.findOne({ 
            _id: room.accommodation._id, 
            owner: req.auth.userId 
        });

        if (!accommodation) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this room"
            });
        }

        // Delete images from Cloudinary (optional - you might want to keep them)
        // if (room.images && room.images.length > 0) {
        //     const deletePromises = room.images.map(async (imageUrl) => {
        //         try {
        //             const publicId = imageUrl.split('/').pop().split('.')[0];
        //             await cloudinary.uploader.destroy(`rooms/${publicId}`);
        //         } catch (deleteError) {
        //             console.error("Error deleting image from Cloudinary:", deleteError);
        //         }
        //     });
        //     await Promise.all(deletePromises);
        // }

        await Room.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Room deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get room by ID
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        const room = await Room.findById(id)
            .populate({
                path: 'accommodation',
                select: 'businessName propertyType address phone email images amenities',
                populate: { 
                    path: 'owner',
                    select: 'firstName lastName image'
                }
            });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Check if user is owner to see unavailable rooms
        if (!room.isAvailable) {
            const isOwner = await Accommodation.findOne({
                _id: room.accommodation._id,
                owner: req.auth.userId
            });

            if (!isOwner) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found"
                });
            }
        }

        res.json({
            success: true,
            room
        });
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API to get room types
export const getRoomTypes = async (req, res) => {
    try {
        const roomTypes = await Room.distinct('roomType');
        
        res.json({
            success: true,
            roomTypes: roomTypes.map(type => ({
                value: type,
                label: type
            }))
        });
    } catch (error) {
        console.error("Error fetching room types:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};