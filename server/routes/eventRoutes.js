import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEventStatus,
  toggleFeatured,
  deleteEvent,
  getEventStats
} from '../controllers/eventController.js';
import { protect, admin, eventOwnerOrAdmin, canCreateEvents, eventIsApproved } from '../middleware/authMiddleware.js';

const eventRouter = express.Router();

// Public routes
eventRouter.get('/', getEvents);
eventRouter.get('/:id', eventIsApproved, getEvent);

// Protected routes - require authentication
eventRouter.use(protect);

// Create event - requires business account
eventRouter.post('/', canCreateEvents, createEvent);

// Admin only routes
eventRouter.get('/admin/stats', admin, getEventStats);
eventRouter.get('/admin/all', admin, getEvents); // Get all events including unpublished
eventRouter.put('/admin/:id/status', admin, updateEventStatus);
eventRouter.patch('/admin/:id/featured', admin, toggleFeatured);
eventRouter.delete('/admin/:id', admin, deleteEvent);

// Event owner routes
//eventRouter.put('/:id', eventOwnerOrAdmin, updateEvent); // You'll need to create this controller
eventRouter.delete('/:id', eventOwnerOrAdmin, deleteEvent);

export default eventRouter;