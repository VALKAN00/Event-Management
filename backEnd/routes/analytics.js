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
  getCustomerEngagement,
  exportAnalytics
} = require('../controllers/analytics');
const { protect, authorize } = require('../middleware/auth');
const { validateDateRange } = require('../middleware/validation');

// Test routes without authentication (for development only) - MUST BE FIRST
router.get('/test/attendees/insights', (req, res) => {
  res.json({
    success: true,
    data: {
      totalAttendees: 1250,
      avgAge: 28.5,
      topAgeGroup: '25-34',
      genderDistribution: {
        male: 45,
        female: 52,
        other: 3
      },
      socialMediaReach: {
        facebook: 2500,
        instagram: 3200,
        twitter: 1800
      }
    }
  });
});

router.get('/test/attendees/locations', (req, res) => {
  res.json({
    success: true,
    data: {
      locations: [
        { city: 'Colombo', attendeeCount: 450, percentage: 36 },
        { city: 'Kandy', attendeeCount: 320, percentage: 26 },
        { city: 'Galle', attendeeCount: 280, percentage: 22 },
        { city: 'Jaffna', attendeeCount: 200, percentage: 16 }
      ]
    }
  });
});

router.get('/test/attendees/age-groups', (req, res) => {
  res.json({
    success: true,
    data: {
      ageGroups: [
        { ageRange: '18-24', count: 320, percentage: 25.6 },
        { ageRange: '25-34', count: 450, percentage: 36 },
        { ageRange: '35-44', count: 280, percentage: 22.4 },
        { ageRange: '45-54', count: 150, percentage: 12 },
        { ageRange: '55+', count: 50, percentage: 4 }
      ]
    }
  });
});

router.get('/test/attendees/gender', (req, res) => {
  res.json({
    success: true,
    data: {
      genderDistribution: [
        { gender: 'Male', count: 563, percentage: 45 },
        { gender: 'Female', count: 650, percentage: 52 },
        { gender: 'Other', count: 37, percentage: 3 }
      ]
    }
  });
});

router.get('/test/attendees/interests', (req, res) => {
  res.json({
    success: true,
    data: {
      interests: [
        { interest: 'Music', count: 450, percentage: 36 },
        { interest: 'Technology', count: 325, percentage: 26 },
        { interest: 'Sports', count: 275, percentage: 22 },
        { interest: 'Arts', count: 200, percentage: 16 }
      ]
    }
  });
});

// All authenticated routes require admin authentication
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
router.get('/customer-engagement', validateDateRange, getCustomerEngagement);

// Export functionality
router.get('/export/:type', validateDateRange, exportAnalytics);

module.exports = router;
