const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { 
  asyncHandler, 
  successResponse, 
  errorResponse,
  getDateRange 
} = require('../utils/helpers');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  // Get basic counts
  const totalEvents = await Event.countDocuments({ 
    organizer: req.user.id,
    isActive: true 
  });

  const totalBookings = await Booking.countDocuments({
    'event': { $in: await Event.find({ organizer: req.user.id }).distinct('_id') },
    bookingDate: { $gte: startDate, $lte: endDate }
  });

  // Get revenue analytics
  const revenueData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        bookingDate: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalTicketsSold: { $sum: { $size: '$seats' } },
        averageTicketPrice: { $avg: '$totalAmount' }
      }
    }
  ]);

  const revenue = revenueData[0] || {
    totalRevenue: 0,
    totalTicketsSold: 0,
    averageTicketPrice: 0
  };

  // Get event status breakdown
  const eventStatusBreakdown = await Event.aggregate([
    {
      $match: {
        organizer: req.user._id,
        isActive: true
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent bookings
  const recentBookings = await Booking.find({
    'event': { $in: await Event.find({ organizer: req.user.id }).distinct('_id') }
  })
    .populate('user', 'name email')
    .populate('event', 'name date venue.city')
    .sort({ bookingDate: -1 })
    .limit(5);

  // Get upcoming events
  const upcomingEvents = await Event.find({
    organizer: req.user.id,
    date: { $gte: new Date() },
    status: 'upcoming',
    isActive: true
  })
    .sort({ date: 1 })
    .limit(5)
    .select('name date venue.name venue.city analytics.totalBookings');

  successResponse(res, {
    overview: {
      totalEvents,
      totalBookings,
      ...revenue
    },
    eventStatusBreakdown,
    recentBookings,
    upcomingEvents,
    period
  }, 'Dashboard statistics retrieved successfully');
});

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month', startDate, endDate } = req.query;
  
  let dateRange;
  if (startDate && endDate) {
    dateRange = { startDate: new Date(startDate), endDate: new Date(endDate) };
  } else {
    dateRange = getDateRange(period);
  }

  // Daily revenue for the period
  const dailyRevenue = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        bookingDate: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$bookingDate' },
          month: { $month: '$bookingDate' },
          day: { $dayOfMonth: '$bookingDate' }
        },
        dailyRevenue: { $sum: '$totalAmount' },
        dailyBookings: { $sum: 1 },
        dailyTickets: { $sum: { $size: '$seats' } }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Revenue by event
  const revenueByEvent = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        bookingDate: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $group: {
        _id: '$event',
        eventName: { $first: '$eventData.name' },
        totalRevenue: { $sum: '$totalAmount' },
        totalBookings: { $sum: 1 },
        totalTickets: { $sum: { $size: '$seats' } },
        averageTicketPrice: { $avg: '$totalAmount' }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    }
  ]);

  // Revenue trends
  const currentPeriodRevenue = dailyRevenue.reduce((sum, day) => sum + day.dailyRevenue, 0);
  
  // Calculate previous period for comparison
  const periodLength = dateRange.endDate - dateRange.startDate;
  const previousStartDate = new Date(dateRange.startDate.getTime() - periodLength);
  const previousEndDate = new Date(dateRange.startDate);

  const previousPeriodRevenue = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        bookingDate: { $gte: previousStartDate, $lte: previousEndDate },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const previousRevenue = previousPeriodRevenue[0]?.totalRevenue || 0;
  const revenueGrowth = previousRevenue > 0 
    ? ((currentPeriodRevenue - previousRevenue) / previousRevenue * 100).toFixed(2)
    : 0;

  successResponse(res, {
    summary: {
      totalRevenue: currentPeriodRevenue,
      previousPeriodRevenue: previousRevenue,
      growthPercentage: parseFloat(revenueGrowth),
      totalBookings: dailyRevenue.reduce((sum, day) => sum + day.dailyBookings, 0),
      totalTickets: dailyRevenue.reduce((sum, day) => sum + day.dailyTickets, 0)
    },
    dailyRevenue,
    revenueByEvent,
    period,
    dateRange
  }, 'Revenue analytics retrieved successfully');
});

// @desc    Get attendee insights
// @route   GET /api/analytics/attendees/insights
// @access  Private/Admin
const getAttendeeInsights = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  // Get all bookings for user's events
  const attendeeData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        bookingDate: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    {
      $unwind: '$userData'
    },
    {
      $project: {
        userId: '$userData._id',
        userName: '$userData.name',
        userEmail: '$userData.email',
        gender: '$userData.profileDetails.gender',
        location: '$userData.profileDetails.location',
        interests: '$userData.profileDetails.interests',
        dateOfBirth: '$userData.profileDetails.dateOfBirth',
        totalAmount: '$totalAmount',
        eventName: '$eventData.name',
        eventDate: '$eventData.date'
      }
    }
  ]);

  // Calculate age groups
  const ageGroups = {
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45+': 0
  };

  attendeeData.forEach(attendee => {
    if (attendee.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(attendee.dateOfBirth).getFullYear();
      if (age >= 18 && age <= 24) ageGroups['18-24']++;
      else if (age >= 25 && age <= 34) ageGroups['25-34']++;
      else if (age >= 35 && age <= 44) ageGroups['35-44']++;
      else if (age >= 45) ageGroups['45+']++;
    }
  });

  // Gender distribution
  const genderDistribution = attendeeData.reduce((acc, attendee) => {
    const gender = attendee.gender || 'not-specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  // Location distribution
  const locationDistribution = attendeeData.reduce((acc, attendee) => {
    const city = attendee.location?.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Interest analysis
  const interestAnalysis = {};
  attendeeData.forEach(attendee => {
    if (attendee.interests && attendee.interests.length > 0) {
      attendee.interests.forEach(interest => {
        interestAnalysis[interest] = (interestAnalysis[interest] || 0) + 1;
      });
    }
  });

  // Unique vs returning attendees
  const uniqueAttendees = [...new Set(attendeeData.map(a => a.userId.toString()))].length;
  const totalAttendances = attendeeData.length;

  successResponse(res, {
    summary: {
      totalAttendees: uniqueAttendees,
      totalAttendances,
      returningAttendeeRate: totalAttendances > 0 
        ? (((totalAttendances - uniqueAttendees) / totalAttendances) * 100).toFixed(2)
        : 0
    },
    demographics: {
      ageGroups,
      genderDistribution,
      locationDistribution
    },
    interests: interestAnalysis,
    period
  }, 'Attendee insights retrieved successfully');
});

// @desc    Get event performance analytics
// @route   GET /api/analytics/events/performance
// @access  Private/Admin
const getEventPerformance = asyncHandler(async (req, res) => {
  const events = await Event.find({
    organizer: req.user.id,
    isActive: true
  }).select('name date venue.city analytics status seatConfiguration');

  const eventPerformance = events.map(event => ({
    id: event._id,
    name: event.name,
    date: event.date,
    city: event.venue.city,
    status: event.status,
    totalSeats: event.seatConfiguration.totalSeats,
    bookedSeats: event.seatConfiguration.bookedSeats,
    occupancyRate: event.occupancyRate,
    totalViews: event.analytics.totalViews,
    totalBookings: event.analytics.totalBookings,
    totalRevenue: event.analytics.totalRevenue,
    socialMediaReach: event.analytics.socialMediaReach
  }));

  // Sort by performance metrics
  const topPerformingEvents = [...eventPerformance]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  const mostViewedEvents = [...eventPerformance]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  successResponse(res, {
    allEvents: eventPerformance,
    topPerforming: topPerformingEvents,
    mostViewed: mostViewedEvents,
    summary: {
      totalEvents: events.length,
      averageOccupancy: eventPerformance.reduce((sum, e) => sum + parseFloat(e.occupancyRate), 0) / events.length,
      totalRevenue: eventPerformance.reduce((sum, e) => sum + e.totalRevenue, 0),
      totalViews: eventPerformance.reduce((sum, e) => sum + e.totalViews, 0)
    }
  }, 'Event performance analytics retrieved successfully');
});

// @desc    Get location analytics
// @route   GET /api/analytics/attendees/locations
// @access  Private/Admin
const getLocationAnalytics = asyncHandler(async (req, res) => {
  const locationData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    {
      $unwind: '$userData'
    },
    {
      $group: {
        _id: '$userData.profileDetails.location.city',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  successResponse(res, locationData, 'Location analytics retrieved successfully');
});

// @desc    Get interest analytics
// @route   GET /api/analytics/attendees/interests
// @access  Private/Admin
const getInterestAnalytics = asyncHandler(async (req, res) => {
  const interestData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    {
      $unwind: '$userData'
    },
    {
      $unwind: '$userData.profileDetails.interests'
    },
    {
      $group: {
        _id: '$userData.profileDetails.interests',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  successResponse(res, interestData, 'Interest analytics retrieved successfully');
});

// @desc    Get age group analytics
// @route   GET /api/analytics/attendees/age-groups
// @access  Private/Admin
const getAgeGroupAnalytics = asyncHandler(async (req, res) => {
  const ageData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    {
      $unwind: '$userData'
    },
    {
      $addFields: {
        age: {
          $subtract: [
            { $year: new Date() },
            { $year: '$userData.profileDetails.dateOfBirth' }
          ]
        }
      }
    },
    {
      $addFields: {
        ageGroup: {
          $switch: {
            branches: [
              { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 24] }] }, then: '18-24' },
              { case: { $and: [{ $gte: ['$age', 25] }, { $lte: ['$age', 34] }] }, then: '25-34' },
              { case: { $and: [{ $gte: ['$age', 35] }, { $lte: ['$age', 44] }] }, then: '35-44' },
              { case: { $gte: ['$age', 45] }, then: '45+' }
            ],
            default: 'Unknown'
          }
        }
      }
    },
    {
      $group: {
        _id: '$ageGroup',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  successResponse(res, ageData, 'Age group analytics retrieved successfully');
});

// @desc    Get gender analytics
// @route   GET /api/analytics/attendees/gender
// @access  Private/Admin
const getGenderAnalytics = asyncHandler(async (req, res) => {
  const genderData = await Booking.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventData'
      }
    },
    {
      $unwind: '$eventData'
    },
    {
      $match: {
        'eventData.organizer': req.user._id,
        status: { $in: ['confirmed', 'checked-in'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    {
      $unwind: '$userData'
    },
    {
      $group: {
        _id: '$userData.profileDetails.gender',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  successResponse(res, genderData, 'Gender analytics retrieved successfully');
});

// @desc    Get social media reach
// @route   GET /api/analytics/social-media
// @access  Private/Admin
const getSocialMediaReach = asyncHandler(async (req, res) => {
  const socialMediaData = await Event.aggregate([
    {
      $match: {
        organizer: req.user._id,
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalInstagram: { $sum: '$analytics.socialMediaReach.instagram' },
        totalFacebook: { $sum: '$analytics.socialMediaReach.facebook' },
        totalTwitter: { $sum: '$analytics.socialMediaReach.twitter' }
      }
    }
  ]);

  const data = socialMediaData[0] || {
    totalInstagram: 0,
    totalFacebook: 0,
    totalTwitter: 0
  };

  successResponse(res, data, 'Social media analytics retrieved successfully');
});

// @desc    Export analytics data
// @route   GET /api/analytics/export/:type
// @access  Private/Admin
const exportAnalytics = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { format = 'json' } = req.query;

  let data;
  
  switch (type) {
    case 'events':
      data = await Event.find({ organizer: req.user.id, isActive: true })
        .select('name date venue analytics seatConfiguration status');
      break;
    
    case 'bookings':
      data = await Booking.find({
        'event': { $in: await Event.find({ organizer: req.user.id }).distinct('_id') }
      })
        .populate('event', 'name')
        .populate('user', 'name email');
      break;
    
    case 'revenue':
      data = await Booking.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'eventData'
          }
        },
        {
          $unwind: '$eventData'
        },
        {
          $match: {
            'eventData.organizer': req.user._id,
            status: { $in: ['confirmed', 'checked-in'] }
          }
        }
      ]);
      break;
    
    default:
      return errorResponse(res, 'Invalid export type', 400);
  }

  if (format === 'csv') {
    // Convert to CSV (simplified version)
    const csv = convertToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-export.csv`);
    return res.send(csv);
  }

  successResponse(res, data, `${type} data exported successfully`);
});

// Helper function to convert to CSV (basic implementation)
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => 
      typeof val === 'object' ? JSON.stringify(val) : val
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
};

module.exports = {
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
};
