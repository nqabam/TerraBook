import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Wildlife Conservation Tour',
      'Eco-Education Workshop',
      'Community Clean-up',
      'Sustainable Farming Experience',
      'Nature Photography Walk',
      'Marine Conservation Activity',
      'Cultural Heritage Tour',
      'Green Technology Showcase',
      'Environmental Film Screening',
      'Other'
    ]
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 100
  },
  ecoFocus: {
    type: String,
    required: true,
    minlength: 50
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  ticketPrice: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  priorityReview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ location: 1 });

export default mongoose.model('Event', eventSchema);