const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  bookmarkEvent,
  getBookmarkedEvents,
  updateEventStatus,
  getEventAnalytics,
  searchEvents
} = require('../controllers/events');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { 
  validateEventCreation, 
  validateEventUpdate, 
  validateObjectId,
  validatePagination 
} = require('../middleware/validation');

// Public routes (with optional auth for bookmarks)
router.get('/', validatePagination, optionalAuth, getEvents);
router.get('/search', validatePagination, searchEvents);
router.get('/:id', validateObjectId(), optionalAuth, getEvent);

// Protected user routes
router.use(protect); // All routes below require authentication

// User routes
router.get('/bookmarks/my', getBookmarkedEvents);
router.post('/:id/bookmark', validateObjectId(), bookmarkEvent);

// Admin routes
router.get('/my/created', authorize('admin'), getMyEvents);
router.post('/', authorize('admin'), validateEventCreation, createEvent);
router.put('/:id', authorize('admin'), validateObjectId(), validateEventUpdate, updateEvent);
router.delete('/:id', authorize('admin'), validateObjectId(), deleteEvent);
router.patch('/:id/status', authorize('admin'), validateObjectId(), updateEventStatus);
router.get('/:id/analytics', authorize('admin'), validateObjectId(), getEventAnalytics);

module.exports = router;
