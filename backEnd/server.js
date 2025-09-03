const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { startUpcomingEventsChecker } = require('./utils/notificationService');

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      process.env.FRONTEND_URL,
      'https://sage-torrone-27fa1c.netlify.app' // Your Netlify domain
    ].filter(Boolean),
    credentials: true
  }
});

// Make io available globally for controllers
global.io = io;

// Security middleware
app.use(helmet());

// Rate limiting - temporarily disabled for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  process.env.FRONTEND_URL,
  'https://sage-torrone-27fa1c.netlify.app' // Your Netlify domain
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventX Studio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  // Handle user joining their personal notification room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`📫 User ${socket.id} joined notifications room: ${userId}`);
  });
  
  // Join user to a room for targeted updates
  socket.on('join-dashboard', () => {
    socket.join('dashboard');
    console.log(`📊 User ${socket.id} joined dashboard room`);
  });

  socket.on('join-users', () => {
    socket.join('users');
    console.log(`👥 User ${socket.id} joined users room`);
  });

  socket.on('join-events', () => {
    socket.join('events');
    console.log(`🎪 User ${socket.id} joined events room`);
  });

  socket.on('join-bookings', () => {
    socket.join('bookings');
    console.log(`📅 User ${socket.id} joined bookings room`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`🔌 Socket.IO enabled for real-time updates`);
  
  // Start notification services
  startUpcomingEventsChecker();
});

module.exports = app;
