import User from '../models/User.js';
import Event from '../models/Event.js';

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    const { userId } = req.auth();
    if (!userId) {
        return res.json({ success: false, message: 'Not authorized, no user found' });
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
}

// Middleware to check if user is admin
export const admin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Not authorized as admin' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Middleware to check if user is event owner or admin
export const eventOwnerOrAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if user is admin or the event organizer
        if (req.user.role === 'admin' || event.organizerId?.toString() === req.user._id.toString()) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Not authorized to modify this event' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Middleware to check if user can create events
export const canCreateEvents = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Allow admins and business owners to create events
        if (['admin', 'business_owner'].includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ 
                success: false, 
                message: 'Not authorized to create events. Business account required.' 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Middleware to check if event is approved
export const eventIsApproved = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.status !== 'approved') {
            return res.status(403).json({ 
                success: false, 
                message: 'Event is not approved yet' 
            });
        }

        req.event = event;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}