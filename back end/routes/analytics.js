const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueAnalytics,
  getAttendeeInsights,
  getEventPerformance,
  getLocationAnalytics,
  getInterestAnalytics,
  getAgeGroupAnalytics,
  getGenderAnalytics,
  getSocialMediaReach,
  exportAnalytics
} = require('../controllers/analytics');
const { protect, authorize } = require('../middleware/auth');
const { validateDateRange } = require('../middleware/validation');

// All routes require admin authentication
router.use(protect, authorize('admin'));

// Dashboard and overview analytics
router.get('/dashboard', validateDateRange, getDashboardStats);
router.get('/revenue', validateDateRange, getRevenueAnalytics);
router.get('/events/performance', validateDateRange, getEventPerformance);

// Attendee analytics
router.get('/attendees/insights', validateDateRange, getAttendeeInsights);
router.get('/attendees/locations', validateDateRange, getLocationAnalytics);
router.get('/attendees/interests', validateDateRange, getInterestAnalytics);
router.get('/attendees/age-groups', validateDateRange, getAgeGroupAnalytics);
router.get('/attendees/gender', validateDateRange, getGenderAnalytics);

// Social media and engagement
router.get('/social-media', validateDateRange, getSocialMediaReach);

// Export functionality
router.get('/export/:type', validateDateRange, exportAnalytics);

module.exports = router;
