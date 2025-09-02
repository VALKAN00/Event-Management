const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('profileDetails.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('profileDetails.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('profileDetails.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  handleValidationErrors
];

// Event validation rules
const validateEventCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Event name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('venue.name')
    .trim()
    .notEmpty()
    .withMessage('Venue name is required'),
  body('venue.address')
    .trim()
    .notEmpty()
    .withMessage('Venue address is required'),
  body('venue.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('venue.capacity')
    .isInt({ min: 1 })
    .withMessage('Venue capacity must be at least 1'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value, { req }) => {
      // Allow admin users to create events with past dates
      if (req.user && req.user.role === 'admin') {
        return true;
      }
      // For non-admin users, enforce future date validation
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('time.start')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('time.end')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  body('pricing.ticketPrice')
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a positive number'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  body('categories.*')
    .optional()
    .isIn(['Live Music', 'EDM Music', 'Innovation', 'Food Festivals', 'Sports', 'Art', 'Technology'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

const validateEventUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Event name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('venue.capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Venue capacity must be at least 1'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('pricing.ticketPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a positive number'),
  handleValidationErrors
];

// Booking validation rules
const validateBookingCreation = [
  body('eventId')
    .isMongoId()
    .withMessage('Please provide a valid event ID'),
  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected'),
  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),
  body('attendeeInfo.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Attendee name must be between 2 and 50 characters'),
  body('attendeeInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('attendeeInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Please provide a valid ${paramName}`),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateEventCreation,
  validateEventUpdate,
  validateBookingCreation,
  validateObjectId,
  validatePagination,
  validateDateRange,
  handleValidationErrors
};
