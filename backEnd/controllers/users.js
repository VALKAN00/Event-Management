const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  getPagination, 
  getPaginationInfo 
} = require('../utils/helpers');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role, isActive } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPagination(page, limit);

  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const users = await User.find(query)
    .select('-password -loginAttempts -lockUntil -emailVerificationToken -passwordResetToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  const totalCount = await User.countDocuments(query);
  const pagination = getPaginationInfo(currentPage, itemsPerPage, totalCount);

  // Get user statistics
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
        regularUsers: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }
      }
    }
  ]);

  successResponse(res, {
    users,
    pagination,
    stats: stats[0] || {}
  }, 'Users retrieved successfully');
});

// @desc    Get single user
// @route   GET /api/users/:id or GET /api/users/profile
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;
  
  // If getting another user's profile, must be admin
  if (req.params.id && req.params.id !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to access this user profile', 401);
  }

  const user = await User.findById(userId)
    .select('-password -loginAttempts -lockUntil -emailVerificationToken -passwordResetToken');

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Get user's booking and event statistics
  const bookingStats = await Booking.aggregate([
    {
      $match: { user: user._id }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  let eventStats = null;
  if (user.role === 'admin') {
    eventStats = await Event.aggregate([
      {
        $match: { organizer: user._id, isActive: true }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalRevenue: { $sum: '$analytics.totalRevenue' },
          totalBookings: { $sum: '$analytics.totalBookings' }
        }
      }
    ]);
  }

  successResponse(res, {
    user,
    statistics: {
      bookings: bookingStats,
      events: eventStats?.[0] || null
    }
  }, 'User profile retrieved successfully');
});

// @desc    Update user profile
// @route   PUT /api/users/:id or PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;
  
  // If updating another user's profile, must be admin
  if (req.params.id && req.params.id !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to update this user profile', 401);
  }

  // Fields that can be updated
  const allowedFields = [
    'name', 
    'email', 
    'profileDetails.phone', 
    'profileDetails.dateOfBirth', 
    'profileDetails.gender', 
    'profileDetails.location', 
    'profileDetails.interests'
  ];

  // Filter request body to only include allowed fields
  const updateData = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key) || key.startsWith('profileDetails.')) {
      updateData[key] = req.body[key];
    }
  });

  // Handle nested profileDetails updates
  if (req.body.profileDetails) {
    Object.keys(req.body.profileDetails).forEach(key => {
      updateData[`profileDetails.${key}`] = req.body.profileDetails[key];
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password -loginAttempts -lockUntil -emailVerificationToken -passwordResetToken');

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  successResponse(res, user, 'Profile updated successfully');
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Don't allow deleting other admins
  if (user.role === 'admin' && req.user.id !== user._id.toString()) {
    return errorResponse(res, 'Cannot delete other admin users', 400);
  }

  // Check if user has any bookings or events
  const hasBookings = await Booking.exists({ user: user._id });
  const hasEvents = await Event.exists({ organizer: user._id });

  if (hasBookings || hasEvents) {
    // Deactivate instead of delete
    user.isActive = false;
    await user.save();
    
    // Emit real-time update
    if (global.io) {
      global.io.to('users').emit('userUpdated', {
        type: 'deactivated',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });
    }
    
    successResponse(res, null, 'User account deactivated (has associated bookings/events)');
  } else {
    const deletedUserId = user._id;
    await User.findByIdAndDelete(req.params.id);
    
    // Emit real-time update
    if (global.io) {
      global.io.to('users').emit('userDeleted', {
        userId: deletedUserId
      });
    }
    
    successResponse(res, null, 'User deleted successfully');
  }
});

// @desc    Get user's bookings
// @route   GET /api/users/profile/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
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

  // Get booking summary
  const summary = await Booking.aggregate([
    {
      $match: { user: req.user._id }
    },
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
    summary
  }, 'User bookings retrieved successfully');
});

// @desc    Get user's events (Admin only)
// @route   GET /api/users/profile/events
// @access  Private/Admin
const getUserEvents = asyncHandler(async (req, res) => {
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

  // Get event summary
  const summary = await Event.aggregate([
    {
      $match: { organizer: req.user._id, isActive: true }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$analytics.totalRevenue' },
        totalBookings: { $sum: '$analytics.totalBookings' }
      }
    }
  ]);

  successResponse(res, {
    events,
    pagination,
    summary
  }, 'User events retrieved successfully');
});

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return errorResponse(res, 'Invalid role. Must be "user" or "admin"', 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Don't allow changing own role
  if (user._id.toString() === req.user.id) {
    return errorResponse(res, 'Cannot change your own role', 400);
  }

  user.role = role;
  await user.save();

    // Emit real-time update
    if (global.io) {
      console.log('🔄 Emitting userUpdated event for role change');
      global.io.to('users').emit('userUpdated', {
        type: 'roleChanged',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });
    }

  successResponse(res, user, `User role updated to ${role}`);
});

// @desc    Deactivate user (Admin only)
// @route   PATCH /api/users/:id/deactivate
// @access  Private/Admin
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Don't allow deactivating self
  if (user._id.toString() === req.user.id) {
    return errorResponse(res, 'Cannot deactivate your own account', 400);
  }

  user.isActive = false;
  await user.save();

  // Emit real-time update
  if (global.io) {
    global.io.to('users').emit('userUpdated', {
      type: 'deactivated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  }

  successResponse(res, user, 'User account deactivated');
});

// @desc    Activate user (Admin only)
// @route   PATCH /api/users/:id/activate
// @access  Private/Admin
const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  user.isActive = true;
  // Reset login attempts when activating
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  // Emit real-time update
  if (global.io) {
    global.io.to('users').emit('userUpdated', {
      type: 'activated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  }

  successResponse(res, user, 'User account activated');
});

module.exports = {
  getAllUsers,
  getUser,
  updateProfile,
  deleteUser,
  getUserBookings,
  getUserEvents,
  updateUserRole,
  deactivateUser,
  activateUser
};
