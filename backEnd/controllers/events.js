const Event = require('../models/Event');
const User = require('../models/User');
const { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  getPagination, 
  getPaginationInfo,
  buildQuery,
  buildSort
} = require('../utils/helpers');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, sortOrder, ...filters } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  // Build query
  const query = buildQuery(filters);
  query.isActive = true;

  // Build sort
  const sort = buildSort(sortBy, sortOrder);

  // Execute query
  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await Event.countDocuments(query);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  successResponse(res, {
    events,
    pagination
  }, 'Events retrieved successfully');
});

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
const searchEvents = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  if (!q) {
    return errorResponse(res, 'Search query is required', 400);
  }

  const searchQuery = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { 'venue.name': { $regex: q, $options: 'i' } },
      { 'venue.city': { $regex: q, $options: 'i' } },
      { categories: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ],
    isActive: true
  };

  const events = await Event.find(searchQuery)
    .populate('organizer', 'name email')
    .sort({ 'analytics.totalViews': -1, createdAt: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await Event.countDocuments(searchQuery);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  successResponse(res, {
    events,
    pagination,
    searchQuery: q
  }, `Found ${totalCount} events matching "${q}"`);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email profileDetails.phone');

  if (!event || !event.isActive) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Increment view count
  event.analytics.totalViews += 1;
  await event.save();

  successResponse(res, event, 'Event retrieved successfully');
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  // Add organizer to req.body
  req.body.organizer = req.user.id;

  // Generate seat map if not provided
  if (!req.body.seatConfiguration || !req.body.seatConfiguration.seatMap) {
    const totalSeats = req.body.venue.capacity;
    const seatMap = [];
    
    for (let i = 1; i <= totalSeats; i++) {
      seatMap.push({
        seatNumber: `S${i.toString().padStart(3, '0')}`,
        row: `R${Math.ceil(i / 10)}`,
        section: 'General',
        status: 'available'
      });
    }

    req.body.seatConfiguration = {
      totalSeats,
      availableSeats: totalSeats,
      bookedSeats: 0,
      reservedSeats: 0,
      seatMap
    };
  }

  const event = await Event.create(req.body);
  await event.populate('organizer', 'name email');

  successResponse(res, event, 'Event created successfully', 201);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Make sure user is event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to update this event', 401);
  }

  // Don't allow updating certain fields if event has bookings
  if (event.analytics.totalBookings > 0) {
    const restrictedFields = ['venue.capacity', 'pricing.ticketPrice', 'date'];
    const hasRestrictedUpdates = restrictedFields.some(field => {
      const keys = field.split('.');
      let reqValue = req.body;
      let eventValue = event;
      
      for (let key of keys) {
        reqValue = reqValue?.[key];
        eventValue = eventValue?.[key];
      }
      
      return reqValue !== undefined && reqValue !== eventValue;
    });

    if (hasRestrictedUpdates) {
      return errorResponse(res, 'Cannot update critical event details after bookings have been made', 400);
    }
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('organizer', 'name email');

  successResponse(res, event, 'Event updated successfully');
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Make sure user is event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to delete this event', 401);
  }

  // Check if event has bookings
  if (event.analytics.totalBookings > 0) {
    return errorResponse(res, 'Cannot delete event with existing bookings', 400);
  }

  await Event.findByIdAndDelete(req.params.id);

  successResponse(res, null, 'Event deleted successfully');
});

// @desc    Get events created by current user
// @route   GET /api/events/my/created
// @access  Private/Admin
const getMyEvents = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  const query = { organizer: req.user.id, isActive: true };
  if (status) query.status = status;

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await Event.countDocuments(query);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  successResponse(res, {
    events,
    pagination
  }, 'Your events retrieved successfully');
});

// @desc    Bookmark/Unbookmark event
// @route   POST /api/events/:id/bookmark
// @access  Private
const bookmarkEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event || !event.isActive) {
    return errorResponse(res, 'Event not found', 404);
  }

  const user = await User.findById(req.user.id);
  
  // Check if already bookmarked
  const bookmarkIndex = user.bookmarkedEvents?.indexOf(req.params.id) ?? -1;
  
  if (bookmarkIndex > -1) {
    // Remove bookmark
    user.bookmarkedEvents.splice(bookmarkIndex, 1);
    await user.save();
    successResponse(res, null, 'Event removed from bookmarks');
  } else {
    // Add bookmark
    if (!user.bookmarkedEvents) user.bookmarkedEvents = [];
    user.bookmarkedEvents.push(req.params.id);
    await user.save();
    successResponse(res, null, 'Event added to bookmarks');
  }
});

// @desc    Get bookmarked events
// @route   GET /api/events/bookmarks/my
// @access  Private
const getBookmarkedEvents = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  const user = await User.findById(req.user.id).populate({
    path: 'bookmarkedEvents',
    match: { isActive: true },
    populate: {
      path: 'organizer',
      select: 'name email'
    },
    options: {
      skip,
      limit: itemsPerPage,
      sort: { createdAt: -1 }
    }
  });

  const events = user.bookmarkedEvents || [];
  const totalCount = user.bookmarkedEvents?.length || 0;
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  successResponse(res, {
    events,
    pagination
  }, 'Bookmarked events retrieved successfully');
});

// @desc    Update event status
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['upcoming', 'active', 'closed', 'cancelled'].includes(status)) {
    return errorResponse(res, 'Invalid status', 400);
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Make sure user is event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to update this event', 401);
  }

  event.status = status;
  await event.save();

  successResponse(res, event, `Event status updated to ${status}`);
});

// @desc    Get event analytics
// @route   GET /api/events/:id/analytics
// @access  Private/Admin
const getEventAnalytics = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return errorResponse(res, 'Event not found', 404);
  }

  // Make sure user is event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to view analytics for this event', 401);
  }

  const analytics = {
    eventId: event._id,
    eventName: event.name,
    basicStats: {
      totalViews: event.analytics.totalViews,
      totalBookings: event.analytics.totalBookings,
      totalRevenue: event.analytics.totalRevenue,
      occupancyRate: event.occupancyRate
    },
    seatInfo: {
      totalSeats: event.seatConfiguration.totalSeats,
      bookedSeats: event.seatConfiguration.bookedSeats,
      availableSeats: event.seatConfiguration.availableSeats,
      reservedSeats: event.seatConfiguration.reservedSeats
    },
    socialMediaReach: event.analytics.socialMediaReach,
    status: event.status,
    popularity: event.popularity
  };

  successResponse(res, analytics, 'Event analytics retrieved successfully');
});

module.exports = {
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
};
