const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventX Studio API is running without MongoDB',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5001
  });
});

// Test route for Postman testing
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    data: {
      server: 'EventX Studio Backend',
      version: '1.0.0',
      status: 'Running'
    }
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`✅ Server is ready for testing!`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

module.exports = app;
