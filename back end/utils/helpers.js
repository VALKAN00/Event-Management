// Async handler to eliminate try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Success response helper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Error response helper
const errorResponse = (res, message = 'Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

// Pagination helper
const getPagination = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    page: currentPage,
    limit: itemsPerPage,
    skip
  };
};

// Generate pagination info
const getPaginationInfo = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    limit
  };
};

// Filter object helper - removes undefined/null values
const filterObject = (obj) => {
  const filtered = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

// Build MongoDB query from request query parameters
const buildQuery = (queryParams) => {
  const query = {};
  const {
    search,
    category,
    city,
    status,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    ...otherParams
  } = queryParams;

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'venue.name': { $regex: search, $options: 'i' } },
      { 'venue.city': { $regex: search, $options: 'i' } }
    ];
  }

  // Category filter
  if (category) {
    query.categories = { $in: Array.isArray(category) ? category : [category] };
  }

  // City filter
  if (city) {
    query['venue.city'] = { $regex: city, $options: 'i' };
  }

  // Status filter
  if (status) {
    query.status = { $in: Array.isArray(status) ? status : [status] };
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query['pricing.ticketPrice'] = {};
    if (minPrice !== undefined) query['pricing.ticketPrice'].$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) query['pricing.ticketPrice'].$lte = parseFloat(maxPrice);
  }

  // Date range filter
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Add other direct filters
  Object.keys(otherParams).forEach(key => {
    if (otherParams[key] !== undefined && otherParams[key] !== '') {
      query[key] = otherParams[key];
    }
  });

  return query;
};

// Sort helper
const buildSort = (sortBy, sortOrder = 'desc') => {
  const sort = {};
  
  if (sortBy) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    // Default sort by creation date
    sort.createdAt = -1;
  }

  return sort;
};

// Generate unique ID
const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
};

// Format date
const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Calculate percentage
const calculatePercentage = (part, whole) => {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100 * 100) / 100; // Round to 2 decimal places
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// Capitalize first letter
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Slugify string
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if date is in the past
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Check if date is today
const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.getDate() === checkDate.getDate() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getFullYear() === checkDate.getFullYear();
};

// Get date range for analytics
const getDateRange = (period) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30); // Last 30 days
  }

  return { startDate, endDate };
};

module.exports = {
  asyncHandler,
  successResponse,
  errorResponse,
  getPagination,
  getPaginationInfo,
  filterObject,
  buildQuery,
  buildSort,
  generateUniqueId,
  formatDate,
  calculatePercentage,
  isValidEmail,
  isValidPhone,
  capitalize,
  slugify,
  deepClone,
  isPastDate,
  isToday,
  getDateRange
};
