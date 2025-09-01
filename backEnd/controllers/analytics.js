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

  // Determine grouping based on period
  let groupBy, dateFormat;
  switch (period) {
    case 'week':
      groupBy = {
        year: { $year: '$bookingDate' },
        month: { $month: '$bookingDate' },
        day: { $dayOfMonth: '$bookingDate' }
      };
      dateFormat = 'day';
      break;
    case 'month':
      groupBy = {
        year: { $year: '$bookingDate' },
        week: { $week: '$bookingDate' }
      };
      dateFormat = 'week';
      break;
    case 'quarter':
    case 'year':
      groupBy = {
        year: { $year: '$bookingDate' },
        month: { $month: '$bookingDate' }
      };
      dateFormat = 'month';
      break;
    default:
      groupBy = {
        year: { $year: '$bookingDate' },
        month: { $month: '$bookingDate' },
        day: { $dayOfMonth: '$bookingDate' }
      };
      dateFormat = 'day';
  }

  // Daily/Weekly/Monthly revenue for the period
  const periodRevenue = await Booking.aggregate([
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
        _id: groupBy,
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 },
        tickets: { $sum: { $size: '$seats' } },
        events: { $addToSet: '$event' }
      }
    },
    {
      $addFields: {
        eventCount: { $size: '$events' }
      }
    },
    {
      $sort: { 
        '_id.year': 1, 
        '_id.month': 1, 
        '_id.week': 1,
        '_id.day': 1 
      }
    }
  ]);

  // Format data for chart
  const formatChartData = (data, period) => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    
    return data.map((item, index) => {
      let name;
      const percentage = totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0;
      
      switch (period) {
        case 'week':
          const date = new Date(item._id.year, item._id.month - 1, item._id.day);
          name = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          name = `Week ${item._id.week}`;
          break;
        case 'quarter':
        case 'year':
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          name = monthNames[item._id.month - 1];
          break;
        default:
          name = `Day ${index + 1}`;
      }

      return {
        name,
        value: item.revenue,
        tickets: item.tickets,
        events: item.eventCount,
        bookings: item.bookings,
        percentage: parseFloat(percentage)
      };
    });
  };

  const dailyRevenue = formatChartData(periodRevenue, period);

  // Revenue trends
  const currentPeriodRevenue = periodRevenue.reduce((sum, item) => sum + item.revenue, 0);
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

  // Revenue trends - use the calculated total from formatChartData function
  
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
      totalBookings: dailyRevenue.reduce((sum, item) => sum + item.bookings, 0),
      totalTickets: dailyRevenue.reduce((sum, item) => sum + item.tickets, 0)
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
        gender: '$attendeeInfo.gender',
        location: '$userData.profileDetails.location',
        interests: '$userData.profileDetails.interests',
        dateOfBirth: '$userData.profileDetails.dateOfBirth',
        totalAmount: '$totalAmount',
        eventName: '$eventData.name',
        eventDate: '$eventData.date',
        eventVenue: '$eventData.venue'
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
    // Try user's location first, then event venue city as fallback
    const city = attendee.location?.city || 
                 attendee.eventVenue?.city || 
                 'Unknown';
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
      // For admin users, show all events; for regular users, show only their events
      const eventFilter = req.user.role === 'admin' ? { isActive: true } : { organizer: req.user.id, isActive: true };
      data = await Event.find(eventFilter)
        .select('name date venue analytics seatConfiguration status organizer')
        .populate('organizer', 'name');
      break;
    
    case 'bookings':
      // For admin users, show all bookings; for regular users, show only their event bookings
      let bookingEventIds;
      if (req.user.role === 'admin') {
        bookingEventIds = await Event.find({ isActive: true }).distinct('_id');
      } else {
        bookingEventIds = await Event.find({ organizer: req.user.id }).distinct('_id');
      }
      
      data = await Booking.find({
        'event': { $in: bookingEventIds }
      })
        .populate('event', 'name')
        .populate('user', 'name email');
      break;
    
    case 'attendees':
      // Get attendee data with detailed information
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
            // For admin users, show all events; for regular users, show only their events
            ...(req.user.role === 'admin' ? {} : { 'eventData.organizer': req.user._id }),
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
            eventName: '$eventData.name',
            eventDate: '$eventData.date',
            eventVenue: '$eventData.venue.name',
            eventCity: '$eventData.venue.city',
            attendeeName: '$userData.name',
            attendeeEmail: '$userData.email',
            attendeePhone: '$userData.profileDetails.phone',
            attendeeGender: '$attendeeInfo.gender',
            attendeeLocation: '$userData.profileDetails.location.city',
            attendeeCountry: '$userData.profileDetails.location.country',
            attendeeInterests: '$userData.profileDetails.interests',
            bookingDate: '$bookingDate',
            ticketType: '$seats.seatType',
            totalAmount: '$totalAmount',
            paymentMethod: '$paymentMethod',
            status: '$status'
          }
        }
      ]);
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
    
    case 'complete':
      // Complete report - combine all data types
      const completeData = {};
      
      // Get events data
      const completeEventFilter = req.user.role === 'admin' ? { isActive: true } : { organizer: req.user.id, isActive: true };
      completeData.events = await Event.find(completeEventFilter)
        .select('name date venue analytics seatConfiguration status organizer')
        .populate('organizer', 'name');
      
      // Get bookings data
      let completeBookingEventIds;
      if (req.user.role === 'admin') {
        completeBookingEventIds = await Event.find({ isActive: true }).distinct('_id');
      } else {
        completeBookingEventIds = await Event.find({ organizer: req.user.id }).distinct('_id');
      }
      
      completeData.bookings = await Booking.find({
        'event': { $in: completeBookingEventIds }
      })
        .populate('event', 'name')
        .populate('user', 'name email');
      
      // Get attendees data
      completeData.attendees = await Booking.aggregate([
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
            ...(req.user.role === 'admin' ? {} : { 'eventData.organizer': req.user._id }),
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
            eventName: '$eventData.name',
            eventDate: '$eventData.date',
            eventVenue: '$eventData.venue.name',
            eventCity: '$eventData.venue.city',
            attendeeName: '$userData.name',
            attendeeEmail: '$userData.email',
            attendeePhone: '$userData.profileDetails.phone',
            attendeeGender: '$attendeeInfo.gender',
            attendeeLocation: '$userData.profileDetails.location.city',
            attendeeCountry: '$userData.profileDetails.location.country',
            attendeeInterests: '$userData.profileDetails.interests',
            bookingDate: '$bookingDate',
            totalAmount: '$totalAmount',
            paymentMethod: '$paymentMethod',
            status: '$status'
          }
        }
      ]);
      
      // Get revenue summary
      completeData.revenue = await Booking.aggregate([
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
            ...(req.user.role === 'admin' ? {} : { 'eventData.organizer': req.user._id }),
            status: { $in: ['confirmed', 'checked-in'] }
          }
        },
        {
          $group: {
            _id: '$event',
            eventName: { $first: '$eventData.name' },
            totalRevenue: { $sum: '$totalAmount' },
            totalBookings: { $sum: 1 },
            averageTicketPrice: { $avg: '$totalAmount' }
          }
        }
      ]);
      
      data = completeData;
      break;
    
    default:
      return errorResponse(res, 'Invalid export type', 400);
  }

  if (format === 'csv') {
    // Convert to CSV with type-specific formatting
    const csv = convertToCSV(data, type);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  }

  successResponse(res, data, `${type} data exported successfully`);
});

// Helper function to convert to CSV (improved implementation)
const convertToCSV = (data, type) => {
  // Special handling for complete report which has different structure
  if (type === 'complete') {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return '';
  } else {
    if (!data || data.length === 0) return '';
  }
  
  let headers, rows;
  
  switch (type) {
    case 'events':
      headers = [
        'Event Name',
        'Event Date',
        'Venue Name',
        'Venue City',
        'Status',
        'Total Bookings',
        'Revenue',
        'Capacity',
        'Organizer',
        'Created Date'
      ];
      
      rows = data.map(event => [
        event.name || '',
        event.date ? new Date(event.date).toLocaleDateString() : '',
        event.venue?.name || '',
        event.venue?.city || '',
        event.status || '',
        event.analytics?.totalBookings || 0,
        event.analytics?.revenue || 0,
        event.seatConfiguration?.totalSeats || 0,
        event.organizer?.name || 'Unknown',
        event.createdAt ? new Date(event.createdAt).toLocaleDateString() : ''
      ]);
      break;
      
    case 'bookings':
      headers = [
        'Booking ID',
        'Event Name',
        'User Name',
        'User Email',
        'Booking Date',
        'Total Amount',
        'Payment Method',
        'Status',
        'Seats Count'
      ];
      
      rows = data.map(booking => [
        booking.bookingId || booking._id,
        booking.event?.name || '',
        booking.user?.name || '',
        booking.user?.email || '',
        booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '',
        booking.totalAmount || 0,
        booking.paymentMethod || '',
        booking.status || '',
        booking.seats?.length || 0
      ]);
      break;
      
    case 'attendees':
      headers = [
        'Event Name',
        'Event Date', 
        'Event Venue',
        'Event City',
        'Attendee Name',
        'Attendee Email',
        'Attendee Phone',
        'Gender',
        'Location',
        'Country',
        'Interests',
        'Booking Date',
        'Total Amount',
        'Payment Method',
        'Status'
      ];
      
      rows = data.map(row => [
        row.eventName || '',
        row.eventDate ? new Date(row.eventDate).toLocaleDateString() : '',
        row.eventVenue || '',
        row.eventCity || '',
        row.attendeeName || '',
        row.attendeeEmail || '',
        row.attendeePhone || '',
        row.attendeeGender || '',
        row.attendeeLocation || '',
        row.attendeeCountry || '',
        Array.isArray(row.attendeeInterests) ? row.attendeeInterests.join('; ') : '',
        row.bookingDate ? new Date(row.bookingDate).toLocaleDateString() : '',
        row.totalAmount || 0,
        row.paymentMethod || '',
        row.status || ''
      ]);
      break;
      
    case 'complete':
      // Complete report combines all data types into one comprehensive CSV
      const completeHeaders = [
        'Report Type',
        'Event Name',
        'Event Date',
        'Venue',
        'City',
        'Item Name/Attendee Name',
        'Email',
        'Phone',
        'Gender',
        'Location',
        'Total Amount',
        'Status',
        'Booking Date',
        'Payment Method',
        'Organizer',
        'Additional Info'
      ];
      
      const completeRows = [];
      
      // Add events data
      if (data.events) {
        data.events.forEach(event => {
          completeRows.push([
            'Event',
            event.name || '',
            event.date ? new Date(event.date).toLocaleDateString() : '',
            event.venue?.name || '',
            event.venue?.city || '',
            '',
            '',
            '',
            '',
            '',
            event.analytics?.revenue || 0,
            event.status || '',
            event.createdAt ? new Date(event.createdAt).toLocaleDateString() : '',
            '',
            event.organizer?.name || 'Unknown',
            `Capacity: ${event.seatConfiguration?.totalSeats || 0}, Bookings: ${event.analytics?.totalBookings || 0}`
          ]);
        });
      }
      
      // Add bookings data
      if (data.bookings) {
        data.bookings.forEach(booking => {
          completeRows.push([
            'Booking',
            booking.event?.name || '',
            '',
            '',
            '',
            booking.user?.name || '',
            booking.user?.email || '',
            '',
            '',
            '',
            booking.totalAmount || 0,
            booking.status || '',
            booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '',
            booking.paymentMethod || '',
            '',
            `Booking ID: ${booking.bookingId || booking._id}, Seats: ${booking.seats?.length || 0}`
          ]);
        });
      }
      
      // Add attendees data
      if (data.attendees) {
        data.attendees.forEach(attendee => {
          completeRows.push([
            'Attendee',
            attendee.eventName || '',
            attendee.eventDate ? new Date(attendee.eventDate).toLocaleDateString() : '',
            attendee.eventVenue || '',
            attendee.eventCity || '',
            attendee.attendeeName || '',
            attendee.attendeeEmail || '',
            attendee.attendeePhone || '',
            attendee.attendeeGender || '',
            attendee.attendeeLocation || '',
            attendee.totalAmount || 0,
            attendee.status || '',
            attendee.bookingDate ? new Date(attendee.bookingDate).toLocaleDateString() : '',
            attendee.paymentMethod || '',
            '',
            `Country: ${attendee.attendeeCountry || ''}, Interests: ${Array.isArray(attendee.attendeeInterests) ? attendee.attendeeInterests.join('; ') : ''}`
          ]);
        });
      }
      
      // Add revenue summary
      if (data.revenue) {
        data.revenue.forEach(revenue => {
          completeRows.push([
            'Revenue Summary',
            revenue.eventName || '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            revenue.totalRevenue || 0,
            'Summary',
            '',
            '',
            '',
            `Total Bookings: ${revenue.totalBookings || 0}, Avg Price: ${revenue.averageTicketPrice || 0}`
          ]);
        });
      }
      
      headers = completeHeaders;
      rows = completeRows;
      break;
      
    default:
      // Generic CSV conversion for other types
      headers = Object.keys(data[0]);
      rows = data.map(row => 
        headers.map(header => {
          const val = row[header];
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val).replace(/"/g, '""');
          }
          return val || '';
        })
      );
  }
  
  // Escape commas and quotes in data
  const escapedRows = rows.map(row => 
    row.map(cell => {
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    })
  );
  
  return [headers.join(','), ...escapedRows.map(row => row.join(','))].join('\n');
};

// @desc    Get customer engagement by event
// @route   GET /api/analytics/customer-engagement
// @access  Private/Admin
const getCustomerEngagement = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  // Get booking data grouped by event
  const eventEngagement = await Booking.aggregate([
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
        _id: '$event',
        eventName: { $first: '$eventData.name' },
        eventStatus: { $first: '$eventData.status' },
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        totalTickets: { $sum: { $size: '$seats' } }
      }
    },
    {
      $sort: { totalBookings: -1 }
    },
    {
      $limit: 5
    }
  ]);

  // Format data for donut chart
  const chartData = eventEngagement.map(event => ({
    name: event.eventName,
    value: event.totalBookings,
    revenue: event.totalRevenue,
    tickets: event.totalTickets,
    status: event.eventStatus
  }));

  successResponse(res, {
    engagementData: chartData,
    period
  }, 'Customer engagement data retrieved successfully');
});

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
  getCustomerEngagement,
  exportAnalytics
};
