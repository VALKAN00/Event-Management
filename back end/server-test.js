const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data for testing
const mockEvents = [
  {
    _id: "64a1b2c3d4e5f6789012345a",
    name: "Summer Music Festival 2025",
    description: "An amazing outdoor music festival featuring top artists from around the world.",
    category: "Music",
    date: "2025-08-30T00:00:00.000Z",
    time: {
      start: "18:00",
      end: "23:00"
    },
    venue: {
      name: "Central Park Amphitheater",
      address: "123 Park Avenue, New York, NY 10001",
      city: "New York",
      state: "NY",
      country: "USA",
      coordinates: {
        latitude: 40.7831,
        longitude: -73.9712
      }
    },
    pricing: {
      ticketPrice: 75,
      currency: "USD"
    },
    capacity: 5000,
    availableSeats: 4750,
    tags: ["music", "festival", "outdoor", "summer"],
    isActive: true,
    status: "active",
    organizer: "64a1b2c3d4e5f6789012345b",
    createdAt: "2025-08-15T10:30:00.000Z",
    updatedAt: "2025-08-21T08:15:00.000Z"
  },
  {
    _id: "64a1b2c3d4e5f6789012345c",
    name: "Tech Innovation Summit",
    description: "Join industry leaders discussing the future of technology and innovation.",
    category: "Technology",
    date: "2025-09-15T00:00:00.000Z",
    time: {
      start: "09:00",
      end: "17:00"
    },
    venue: {
      name: "Tech Convention Center",
      address: "456 Innovation Drive, San Francisco, CA 94105",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    pricing: {
      ticketPrice: 150,
      currency: "USD"
    },
    capacity: 1000,
    availableSeats: 850,
    tags: ["technology", "innovation", "conference", "networking"],
    isActive: true,
    status: "active",
    organizer: "64a1b2c3d4e5f6789012345d",
    createdAt: "2025-08-10T14:20:00.000Z",
    updatedAt: "2025-08-20T16:45:00.000Z"
  }
];

const mockUsers = [
  {
    _id: "64a1b2c3d4e5f6789012345b",
    name: "John Doe",
    email: "john@example.com",
    role: "organizer"
  }
];

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventX Studio API is running (Test Mode - No Database)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'Mock Data (No MongoDB Connection)'
  });
});

// Mock Events Routes
app.get('/api/events', (req, res) => {
  const { category, city, search, page = 1, limit = 10 } = req.query;
  
  let filteredEvents = [...mockEvents];
  
  // Apply filters
  if (category) {
    filteredEvents = filteredEvents.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (city) {
    filteredEvents = filteredEvents.filter(event => 
      event.venue.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  if (search) {
    filteredEvents = filteredEvents.filter(event => 
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  
  res.status(200).json({
    success: true,
    data: {
      events: paginatedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredEvents.length / limit),
        totalCount: filteredEvents.length,
        hasNext: endIndex < filteredEvents.length,
        hasPrev: page > 1
      }
    },
    message: 'Events retrieved successfully (Mock Data)'
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = mockEvents.find(e => e._id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: event,
    message: 'Event retrieved successfully (Mock Data)'
  });
});

// Mock Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }
  
  // Mock response
  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: "64a1b2c3d4e5f6789012345e",
        name,
        email,
        role: "user"
      },
      token: "mock_jwt_token_12345"
    },
    message: 'User registered successfully (Mock Data)'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Mock response
  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: "64a1b2c3d4e5f6789012345e",
        name: "Test User",
        email,
        role: "user"
      },
      token: "mock_jwt_token_12345"
    },
    message: 'Login successful (Mock Data)'
  });
});

// Mock Bookings Routes
app.get('/api/bookings/my', (req, res) => {
  // Mock response - requires authentication header check
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      bookings: [
        {
          _id: "64a1b2c3d4e5f6789012345f",
          bookingId: "BK-001-2025",
          event: mockEvents[0],
          seats: [
            { seatNumber: "A1", row: "A", section: "VIP", price: 75 }
          ],
          totalAmount: 75,
          status: "confirmed",
          bookingDate: "2025-08-20T10:30:00.000Z"
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        hasNext: false,
        hasPrev: false
      }
    },
    message: 'User bookings retrieved successfully (Mock Data)'
  });
});

app.post('/api/bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  const { eventId, seats } = req.body;
  
  if (!eventId || !seats || !Array.isArray(seats)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide eventId and seats array'
    });
  }
  
  // Mock booking creation
  res.status(201).json({
    success: true,
    data: {
      _id: "64a1b2c3d4e5f6789012345f",
      bookingId: "BK-002-2025",
      event: mockEvents.find(e => e._id === eventId) || mockEvents[0],
      seats: seats.map(seat => ({
        seatNumber: seat.seatNumber || "A1",
        row: seat.row || "A",
        section: seat.section || "General",
        price: 75
      })),
      totalAmount: seats.length * 75,
      status: "pending",
      bookingDate: new Date().toISOString(),
      qrCode: "mock_qr_code_data"
    },
    message: 'Booking created successfully (Mock Data)'
  });
});

// Analytics Route
app.get('/api/analytics/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      totalEvents: 2,
      totalBookings: 15,
      totalRevenue: 2250,
      activeEvents: 2,
      upcomingEvents: 2,
      recentBookings: [
        {
          _id: "64a1b2c3d4e5f6789012345f",
          bookingId: "BK-001-2025",
          eventName: "Summer Music Festival 2025",
          amount: 75,
          status: "confirmed",
          date: "2025-08-21T08:30:00.000Z"
        }
      ]
    },
    message: 'Analytics data retrieved successfully (Mock Data)'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📊 Using mock data (no database connection required)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
