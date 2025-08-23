const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateProfile,
  deleteUser,
  getUserBookings,
  getUserEvents,
  updateUserRole,
  deactivateUser,
  activateUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const { 
  validateUserUpdate, 
  validateObjectId,
  validatePagination 
} = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', getUser);
router.put('/profile', validateUserUpdate, updateProfile);
router.get('/profile/bookings', validatePagination, getUserBookings);
router.get('/profile/events', authorize('admin'), validatePagination, getUserEvents);

// Admin-only routes
router.get('/', authorize('admin'), validatePagination, getAllUsers);
router.get('/:id', authorize('admin'), validateObjectId(), getUser);
router.put('/:id', authorize('admin'), validateObjectId(), validateUserUpdate, updateProfile);
router.delete('/:id', authorize('admin'), validateObjectId(), deleteUser);
router.patch('/:id/role', authorize('admin'), validateObjectId(), updateUserRole);
router.patch('/:id/deactivate', authorize('admin'), validateObjectId(), deactivateUser);
router.patch('/:id/activate', authorize('admin'), validateObjectId(), activateUser);

module.exports = router;
