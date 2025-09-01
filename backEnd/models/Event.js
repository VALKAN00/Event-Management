const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required']
    },
    address: {
      type: String,
      required: [true, 'Venue address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    country: {
      type: String,
      default: 'Sri Lanka'
    },
    capacity: {
      type: Number,
      required: [true, 'Venue capacity is required'],
      min: [1, 'Capacity must be at least 1']
    }
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    start: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
    },
    end: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
    }
  },
  pricing: {
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR'
    }
  },
  categories: [{
    type: String,
    enum: ['Live Music', 'EDM Music', 'Innovation', 'Food Festivals', 'Sports', 'Art', 'Technology']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed', 'cancelled'],
    default: 'upcoming'
  },
  popularity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  seatConfiguration: {
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
      type: Number,
      required: true
    },
    bookedSeats: {
      type: Number,
      default: 0
    },
    reservedSeats: {
      type: Number,
      default: 0
    },
    seatMap: [{
      seatNumber: {
        type: String,
        required: true
      },
      row: String,
      section: String,
      status: {
        type: String,
        enum: ['available', 'booked', 'reserved'],
        default: 'available'
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    socialMediaReach: {
      instagram: { type: Number, default: 0 },
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 }
    }
  },
  qrCodeEnabled: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Notification tracking
  notificationSent24h: {
    type: Boolean,
    default: false
  },
  notificationSentWeek: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for seats sold percentage
eventSchema.virtual('occupancyRate').get(function() {
  if (this.seatConfiguration.totalSeats === 0) return 0;
  return ((this.seatConfiguration.bookedSeats / this.seatConfiguration.totalSeats) * 100).toFixed(2);
});

// Virtual for event status based on date
eventSchema.virtual('computedStatus').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (this.status === 'cancelled') return 'cancelled';
  if (eventDate < now) return 'closed';
  if (eventDate.toDateString() === now.toDateString()) return 'active';
  return 'upcoming';
});

// Index for efficient queries
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ 'venue.city': 1 });
eventSchema.index({ categories: 1 });
eventSchema.index({ organizer: 1 });

// Pre-save middleware to update available seats
eventSchema.pre('save', function(next) {
  if (this.isModified('seatConfiguration.bookedSeats') || this.isModified('seatConfiguration.reservedSeats')) {
    this.seatConfiguration.availableSeats = this.seatConfiguration.totalSeats - 
                                           this.seatConfiguration.bookedSeats - 
                                           this.seatConfiguration.reservedSeats;
  }
  next();
});

// Instance method to book seats
eventSchema.methods.bookSeats = function(seatNumbers, userId) {
  const bookedSeats = [];
  
  seatNumbers.forEach(seatNumber => {
    const seat = this.seatConfiguration.seatMap.find(s => s.seatNumber === seatNumber);
    if (seat && seat.status === 'available') {
      seat.status = 'booked';
      seat.bookedBy = userId;
      bookedSeats.push(seatNumber);
    }
  });

  if (bookedSeats.length > 0) {
    this.seatConfiguration.bookedSeats += bookedSeats.length;
    this.analytics.totalBookings += 1;
    this.analytics.totalRevenue += this.pricing.ticketPrice * bookedSeats.length;
  }

  return bookedSeats;
};

// Instance method to release seats
eventSchema.methods.releaseSeats = function(seatNumbers) {
  const releasedSeats = [];
  
  seatNumbers.forEach(seatNumber => {
    const seat = this.seatConfiguration.seatMap.find(s => s.seatNumber === seatNumber);
    if (seat && seat.status === 'booked') {
      seat.status = 'available';
      seat.bookedBy = undefined;
      releasedSeats.push(seatNumber);
    }
  });

  if (releasedSeats.length > 0) {
    this.seatConfiguration.bookedSeats -= releasedSeats.length;
    this.analytics.totalRevenue -= this.pricing.ticketPrice * releasedSeats.length;
  }

  return releasedSeats;
};

// Static method to get events by status
eventSchema.statics.getEventsByStatus = function(status) {
  return this.find({ status, isActive: true }).populate('organizer', 'name email');
};

// Static method to get popular events
eventSchema.statics.getPopularEvents = function(limit = 10) {
  return this.find({ status: { $in: ['upcoming', 'active'] }, isActive: true })
             .sort({ 'analytics.totalViews': -1, 'analytics.totalBookings': -1 })
             .limit(limit)
             .populate('organizer', 'name email');
};

module.exports = mongoose.model('Event', eventSchema);
