import Event from '../models/Event.js';
import { sendEventSubmissionEmail, sendEventApprovalEmail } from '../services/emailService.js';

// Create new event submission
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      date: new Date(req.body.date),
      organizerId: req.user._id
    };

    // Check if event focuses on conservation, education, or community development for priority review
    const priorityKeywords = ['conservation', 'education', 'community', 'sustainable', 'eco', 'environment'];
    const hasPriority = priorityKeywords.some(keyword => 
      eventData.description.toLowerCase().includes(keyword) || 
      eventData.ecoFocus.toLowerCase().includes(keyword)
    );

    const event = new Event({
      ...eventData,
      priorityReview: hasPriority
    });

    await event.save();

    // Send confirmation email to organizer
    await sendEventSubmissionEmail(event);

    res.status(201).json({
      success: true,
      message: 'Event submitted successfully! It will be reviewed within 3 business days.',
      data: event
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all events (with filtering)
export const getEvents = async (req, res) => {
  try {
    const { status, eventType, page = 1, limit = 10, featured } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (featured) filter.featured = featured === 'true';

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update event status (admin only)
export const updateEventStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Send approval/rejection email
    if (status === 'approved') {
      await sendEventApprovalEmail(event);
    }

    res.json({
      success: true,
      message: `Event ${status} successfully`,
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle featured status (admin only)
export const toggleFeatured = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.featured = !event.featured;
    await event.save();

    res.json({
      success: true,
      message: `Event ${event.featured ? 'featured' : 'unfeatured'} successfully`,
      data: event
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get events statistics (admin only)
export const getEventStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      status: 'approved',
      date: { $gte: new Date() }
    });

    res.json({
      success: true,
      data: {
        byStatus: stats,
        total: totalEvents,
        upcoming: upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};