const mongoose = require('mongoose');
const QRCode = require('qrcode');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  seats: [{
    seatNumber: {
      type: String,
      required: true
    },
    row: String,
    section: String,
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'checked-in'],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['cash', 'card', 'mobile', 'bank_transfer'],
      default: 'card'
    },
    transactionId: String,
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  qrCode: {
    data: String,
    image: String // Base64 encoded QR code image
  },
  checkInDetails: {
    checkInTime: Date,
    checkInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isCheckedIn: {
      type: Boolean,
      default: false
    }
  },
  attendeeInfo: {
    name: String,
    email: String,
    phone: String,
    specialRequirements: String
  },
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  refundDetails: {
    refundAmount: Number,
    refundDate: Date,
    refundReason: String,
    refundMethod: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, event: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'paymentDetails.paymentStatus': 1 });

// Pre-save middleware to generate booking ID
bookingSchema.pre('validate', async function(next) {
  if (!this.bookingId) {
    // Generate unique booking ID
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.bookingId = `BK${timestamp}${randomStr}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to generate QR code
bookingSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'confirmed' && !this.qrCode.data) {
    try {
      // Create QR code data
      const qrData = {
        bookingId: this.bookingId,
        eventId: this.event,
        userId: this.user,
        seats: this.seats.map(seat => seat.seatNumber),
        bookingDate: this.bookingDate,
        totalAmount: this.totalAmount
      };

      this.qrCode.data = JSON.stringify(qrData);
      
      // Generate QR code image
      const qrCodeImage = await QRCode.toDataURL(this.qrCode.data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.qrCode.image = qrCodeImage;
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
  next();
});

// Instance method to confirm booking
bookingSchema.methods.confirmBooking = function() {
  this.status = 'confirmed';
  this.paymentDetails.paymentStatus = 'completed';
  this.paymentDetails.paymentDate = new Date();
  return this.save();
};

// Instance method to cancel booking
bookingSchema.methods.cancelBooking = function(reason) {
  this.status = 'cancelled';
  if (reason) {
    this.refundDetails = {
      refundReason: reason,
      refundDate: new Date()
    };
  }
  return this.save();
};

// Instance method to check in
bookingSchema.methods.checkIn = function(checkedInBy) {
  this.checkInDetails.isCheckedIn = true;
  this.checkInDetails.checkInTime = new Date();
  this.checkInDetails.checkInBy = checkedInBy;
  this.status = 'checked-in';
  return this.save();
};

// Instance method to validate QR code
bookingSchema.methods.validateQRCode = function(qrData) {
  try {
    const parsedData = JSON.parse(qrData);
    return parsedData.bookingId === this.bookingId && 
           parsedData.eventId.toString() === this.event.toString();
  } catch (error) {
    return false;
  }
};

// Static method to get user bookings
bookingSchema.statics.getUserBookings = function(userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
             .populate('event', 'name date venue.name venue.city time.start time.end')
             .populate('user', 'name email')
             .sort({ bookingDate: -1 });
};

// Static method to get event bookings
bookingSchema.statics.getEventBookings = function(eventId, status = null) {
  const query = { event: eventId };
  if (status) query.status = status;
  
  return this.find(query)
             .populate('user', 'name email phone profileDetails.location')
             .sort({ bookingDate: -1 });
};

// Static method to get booking analytics
bookingSchema.statics.getBookingAnalytics = function(startDate, endDate) {
  const matchStage = {
    bookingDate: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      $lte: endDate || new Date()
    }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        avgBookingValue: { $avg: '$totalAmount' }
      }
    }
  ]);
};

// Virtual for formatted booking date
bookingSchema.virtual('formattedBookingDate').get(function() {
  return this.bookingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

module.exports = mongoose.model('Booking', bookingSchema);
