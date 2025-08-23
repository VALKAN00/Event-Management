const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  getPagination, 
  getPaginationInfo 
} = require('../utils/helpers');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats, attendeeInfo } = req.body;

  // Check if event exists and is available for booking
  const event = await Event.findById(eventId);
  if (!event || !event.isActive) {
    return errorResponse(res, 'Event not found or not available for booking', 404);
  }

  // Check if event is not closed or cancelled
  if (['closed', 'cancelled'].includes(event.status)) {
    return errorResponse(res, 'Event is not available for booking', 400);
  }

  // Check if seats are available
  const requestedSeatNumbers = seats.map(seat => seat.seatNumber);
  const unavailableSeats = [];

  requestedSeatNumbers.forEach(seatNumber => {
    const seat = event.seatConfiguration.seatMap.find(s => s.seatNumber === seatNumber);
    if (!seat || seat.status !== 'available') {
      unavailableSeats.push(seatNumber);
    }
  });

  if (unavailableSeats.length > 0) {
    return errorResponse(res, `Seats not available: ${unavailableSeats.join(', ')}`, 400);
  }

  // Calculate total amount
  const totalAmount = seats.length * event.pricing.ticketPrice;

  // Create booking
  const booking = await Booking.create({
    user: req.user.id,
    event: eventId,
    seats: seats.map(seat => ({
      seatNumber: seat.seatNumber,
      row: seat.row || 'General',
      section: seat.section || 'General',
      price: event.pricing.ticketPrice
    })),
    totalAmount,
    currency: event.pricing.currency,
    attendeeInfo: attendeeInfo || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.profileDetails?.phone
    }
  });

  // Book seats in event
  const bookedSeats = event.bookSeats(requestedSeatNumbers, req.user.id);
  await event.save();

  if (bookedSeats.length !== requestedSeatNumbers.length) {
    return errorResponse(res, 'Some seats could not be booked', 400);
  }

  await booking.populate([
    { path: 'user', select: 'name email' },
    { path: 'event', select: 'name date venue.name venue.city time.start time.end' }
  ]);

  successResponse(res, booking, 'Booking created successfully', 201);
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  const query = { user: req.user.id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('event', 'name date venue.name venue.city time.start time.end status')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await Booking.countDocuments(query);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  successResponse(res, {
    bookings,
    pagination
  }, 'Your bookings retrieved successfully');
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email profileDetails.phone')
    .populate('event', 'name date venue time organizer status');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check if user owns this booking or is admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to access this booking', 401);
  }

  successResponse(res, booking, 'Booking retrieved successfully');
});

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id).populate('event');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return errorResponse(res, 'Not authorized to cancel this booking', 401);
  }

  // Check if booking can be cancelled
  if (['cancelled', 'refunded', 'checked-in'].includes(booking.status)) {
    return errorResponse(res, 'Booking cannot be cancelled', 400);
  }

  // Check if event date is in the future (allow cancellation up to 24 hours before)
  const eventDate = new Date(booking.event.date);
  const now = new Date();
  const timeDiff = eventDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);

  if (hoursDiff < 24) {
    return errorResponse(res, 'Cannot cancel booking less than 24 hours before the event', 400);
  }

  // Cancel booking
  await booking.cancelBooking(reason);

  // Release seats in event
  const event = booking.event;
  const seatNumbers = booking.seats.map(seat => seat.seatNumber);
  event.releaseSeats(seatNumbers);
  await event.save();

  successResponse(res, booking, 'Booking cancelled successfully');
});

// @desc    Confirm booking (payment completion)
// @route   PATCH /api/bookings/:id/confirm
// @access  Private
const confirmBooking = asyncHandler(async (req, res) => {
  const { transactionId, paymentMethod } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return errorResponse(res, 'Not authorized to confirm this booking', 401);
  }

  // Check if booking is in pending status
  if (booking.status !== 'pending') {
    return errorResponse(res, 'Booking cannot be confirmed', 400);
  }

  // Update payment details
  booking.paymentDetails.transactionId = transactionId;
  booking.paymentDetails.method = paymentMethod || 'card';

  // Confirm booking
  await booking.confirmBooking();

  await booking.populate([
    { path: 'user', select: 'name email' },
    { path: 'event', select: 'name date venue.name venue.city time.start time.end' }
  ]);

  successResponse(res, booking, 'Booking confirmed successfully');
});

// @desc    Get bookings for an event
// @route   GET /api/bookings/event/:eventId
// @access  Private/Admin
const getEventBookings = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { page, limit, status } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  // Check if event exists and user has access
  const event = await Event.findById(eventId);
  if (!event) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Check if user is event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to view bookings for this event', 401);
  }

  const query = { event: eventId };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('user', 'name email profileDetails.phone profileDetails.location')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await Booking.countDocuments(query);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  // Get booking summary
  const summary = await Booking.aggregate([
    { $match: { event: event._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  successResponse(res, {
    bookings,
    pagination,
    summary,
    eventName: event.name
  }, 'Event bookings retrieved successfully');
});

// @desc    Check in booking
// @route   PATCH /api/bookings/:id/checkin
// @access  Private/Admin
const checkInBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');

  if (!booking) {
    return errorResponse(res, 'Booking not found', 404);
  }

  // Check if user is event organizer or admin
  if (booking.event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to check in this booking', 401);
  }

  // Check if booking is confirmed
  if (booking.status !== 'confirmed') {
    return errorResponse(res, 'Only confirmed bookings can be checked in', 400);
  }

  // Check if already checked in
  if (booking.checkInDetails.isCheckedIn) {
    return errorResponse(res, 'Booking already checked in', 400);
  }

  // Check in
  await booking.checkIn(req.user.id);

  await booking.populate('user', 'name email');

  successResponse(res, booking, 'Booking checked in successfully');
});

// @desc    Validate QR code
// @route   POST /api/bookings/validate-qr
// @access  Private/Admin
const validateQRCode = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    return errorResponse(res, 'QR code data is required', 400);
  }

  try {
    const parsedData = JSON.parse(qrData);
    
    const booking = await Booking.findOne({ bookingId: parsedData.bookingId })
      .populate('event', 'name date venue organizer')
      .populate('user', 'name email');

    if (!booking) {
      return errorResponse(res, 'Invalid QR code', 400);
    }

    // Check if user is event organizer or admin
    if (booking.event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to validate this QR code', 401);
    }

    // Validate QR code
    const isValid = booking.validateQRCode(qrData);

    if (!isValid) {
      return errorResponse(res, 'Invalid QR code', 400);
    }

    successResponse(res, {
      booking,
      isValid: true,
      canCheckIn: booking.status === 'confirmed' && !booking.checkInDetails.isCheckedIn
    }, 'QR code validated successfully');

  } catch (error) {
    return errorResponse(res, 'Invalid QR code format', 400);
  }
});

// @desc    Get booking analytics
// @route   GET /api/bookings/analytics/summary
// @access  Private/Admin
const getBookingAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Date range
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const analytics = await Booking.getBookingAnalytics(start, end);

  // Get bookings by status
  const statusAnalytics = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Get top events by bookings
  const topEvents = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: start, $lte: end },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $group: {
        _id: '$event',
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: '_id',
        as: 'event'
      }
    },
    {
      $unwind: '$event'
    },
    {
      $project: {
        eventName: '$event.name',
        totalBookings: 1,
        totalRevenue: 1
      }
    },
    {
      $sort: { totalBookings: -1 }
    },
    {
      $limit: 10
    }
  ]);

  successResponse(res, {
    summary: analytics[0] || {},
    statusBreakdown: statusAnalytics,
    topEvents,
    dateRange: { startDate: start, endDate: end }
  }, 'Booking analytics retrieved successfully');
});

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  confirmBooking,
  getEventBookings,
  checkInBooking,
  validateQRCode,
  getBookingAnalytics
};
