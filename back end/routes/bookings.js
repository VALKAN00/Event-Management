const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  confirmBooking,
  getEventBookings,
  checkInBooking,
  validateQRCode,
  getBookingAnalytics
} = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');
const { 
  validateBookingCreation, 
  validateObjectId,
  validatePagination 
} = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', validateBookingCreation, createBooking);
router.get('/my', validatePagination, getMyBookings);
router.get('/:id', validateObjectId(), getBooking);
router.patch('/:id/cancel', validateObjectId(), cancelBooking);
router.patch('/:id/confirm', validateObjectId(), confirmBooking);

// Admin routes
router.get('/event/:eventId', authorize('admin'), validateObjectId('eventId'), validatePagination, getEventBookings);
router.patch('/:id/checkin', authorize('admin'), validateObjectId(), checkInBooking);
router.post('/validate-qr', authorize('admin'), validateQRCode);
router.get('/analytics/summary', authorize('admin'), getBookingAnalytics);

module.exports = router;
