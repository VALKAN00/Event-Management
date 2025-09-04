# EventX Studio API Documentation

## 🚀 Overview

EventX Studio is a comprehensive Event Management Platform API built with Node.js, Express.js, and MongoDB. This API provides complete functionality for event creation, user management, booking system, and analytics dashboard.

### 🔗 Base Information
- **Base URL**: Production:  `https://eventx-studio-api.render.com/api` Development:`http://localhost:5000/api`  
- **Current Version**: v1.0.0
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Content Type**: `application/json`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Events Management](#events-management)
3. [Booking System](#booking-system)
4. [Analytics Dashboard](#analytics-dashboard)
5. [User Management](#user-management)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)
8. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "createdAt": "2025-08-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Get My Profile
**GET** `/auth/me` 🔒

Get current user profile information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "profileDetails": {
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "gender": "male"
    },
    "createdAt": "2025-08-21T10:30:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### Logout User
**POST** `/auth/logout` 🔒

Logout current user session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🎉 Events Management

### Get All Events
**GET** `/events`

Retrieve all active events with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `city` (string): Filter by city
- `search` (string): Search in name and description

**Example:** `/events?page=1&limit=10&category=Technology&city=San Francisco&search=tech`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "_id": "64a1b2c3d4e5f6789012345a",
        "name": "Tech Innovation Summit 2025",
        "description": "Join industry leaders discussing the future of technology...",
        "categories": ["Technology"],
        "date": "2025-09-15T00:00:00.000Z",
        "time": {
          "start": "09:00",
          "end": "17:00"
        },
        "venue": {
          "name": "Tech Convention Center",
          "address": "456 Innovation Drive",
          "city": "San Francisco",
          "country": "USA",
          "capacity": 1000
        },
        "pricing": {
          "ticketPrice": 150,
          "currency": "USD"
        },
        "seatConfiguration": {
          "totalSeats": 1000,
          "availableSeats": 850
        },
        "status": "active",
        "organizer": "64a1b2c3d4e5f6789012345b",
        "createdAt": "2025-08-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 25,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Events retrieved successfully"
}
```

### Create Event
**POST** `/events` 🔒

Create a new event (requires authentication).

**Request Body:**
```json
{
  "name": "Tech Innovation Summit 2025",
  "description": "Join industry leaders discussing the future of technology and innovation.",
  "categories": ["Technology"],
  "date": "2025-09-15",
  "time": {
    "start": "09:00",
    "end": "17:00"
  },
  "venue": {
    "name": "Tech Convention Center",
    "address": "456 Innovation Drive, San Francisco, CA 94105",
    "city": "San Francisco",
    "country": "USA",
    "capacity": 1000
  },
  "pricing": {
    "ticketPrice": 150,
    "currency": "USD"
  },
  "seatConfiguration": {
    "totalSeats": 1000,
    "availableSeats": 1000
  },
  "tags": ["technology", "innovation", "conference"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "name": "Tech Innovation Summit 2025",
    "description": "Join industry leaders discussing the future of technology and innovation.",
    "categories": ["Technology"],
    "date": "2025-09-15T00:00:00.000Z",
    "venue": {
      "name": "Tech Convention Center",
      "city": "San Francisco",
      "capacity": 1000
    },
    "pricing": {
      "ticketPrice": 150,
      "currency": "USD"
    },
    "status": "upcoming",
    "organizer": "64a1b2c3d4e5f6789012345b",
    "createdAt": "2025-08-21T10:30:00.000Z"
  },
  "message": "Event created successfully"
}
```

### Get Event by ID
**GET** `/events/{eventId}`

Get details of a specific event.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "name": "Tech Innovation Summit 2025",
    "description": "Join industry leaders discussing the future of technology and innovation.",
    "categories": ["Technology"],
    "date": "2025-09-15T00:00:00.000Z",
    "time": {
      "start": "09:00",
      "end": "17:00"
    },
    "venue": {
      "name": "Tech Convention Center",
      "address": "456 Innovation Drive, San Francisco, CA 94105",
      "city": "San Francisco",
      "country": "USA",
      "capacity": 1000
    },
    "pricing": {
      "ticketPrice": 150,
      "currency": "USD"
    },
    "seatConfiguration": {
      "totalSeats": 1000,
      "availableSeats": 850,
      "bookedSeats": 150
    },
    "tags": ["technology", "innovation", "conference"],
    "status": "active",
    "organizer": {
      "_id": "64a1b2c3d4e5f6789012345b",
      "name": "Event Organizer",
      "email": "organizer@example.com"
    }
  },
  "message": "Event retrieved successfully"
}
```

### Update Event
**PUT** `/events/{eventId}` 🔒

Update an existing event (only event organizer).

**Request Body:**
```json
{
  "name": "Tech Innovation Summit 2025 - Updated",
  "description": "Updated description with new workshops added.",
  "pricing": {
    "ticketPrice": 175,
    "currency": "USD"
  }
}
```

### Delete Event
**DELETE** `/events/{eventId}` 🔒

Delete an event (only event organizer or admin).

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Get My Events
**GET** `/events/my` 🔒

Get events created by the current user.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

---

## 🎫 Booking System

### Create Booking
**POST** `/bookings` 🔒

Create a new booking for an event.

**Request Body:**
```json
{
  "eventId": "64a1b2c3d4e5f6789012345a",
  "seats": [
    {
      "seatNumber": "A1",
      "row": "A",
      "section": "VIP"
    },
    {
      "seatNumber": "A2",
      "row": "A",
      "section": "VIP"
    }
  ],
  "attendeeInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345c",
    "bookingId": "BK-001-2025",
    "user": {
      "_id": "64a1b2c3d4e5f6789012345a",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "event": {
      "_id": "64a1b2c3d4e5f6789012345b",
      "name": "Tech Innovation Summit 2025",
      "date": "2025-09-15T00:00:00.000Z",
      "venue": {
        "name": "Tech Convention Center",
        "city": "San Francisco"
      }
    },
    "seats": [
      {
        "seatNumber": "A1",
        "row": "A",
        "section": "VIP",
        "price": 150
      },
      {
        "seatNumber": "A2",
        "row": "A",
        "section": "VIP",
        "price": 150
      }
    ],
    "totalAmount": 300,
    "currency": "USD",
    "status": "pending",
    "bookingDate": "2025-08-21T10:30:00.000Z"
  },
  "message": "Booking created successfully"
}
```

### Get My Bookings
**GET** `/bookings/my` 🔒

Get current user's bookings.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (pending, confirmed, cancelled, checked-in)

### Get Booking by ID
**GET** `/bookings/{bookingId}` 🔒

Get details of a specific booking.

### Confirm Booking (Payment)
**PATCH** `/bookings/{bookingId}/confirm` 🔒

Confirm a booking and simulate payment.

**Request Body:**
```json
{
  "transactionId": "TXN123456789",
  "paymentMethod": "card"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345c",
    "bookingId": "BK-001-2025",
    "status": "confirmed",
    "paymentDetails": {
      "transactionId": "TXN123456789",
      "method": "card",
      "paidAt": "2025-08-21T10:35:00.000Z"
    },
    "qrCode": {
      "data": "{\"bookingId\":\"BK-001-2025\",\"eventId\":\"64a1b2c3d4e5f6789012345b\",\"timestamp\":\"2025-08-21T10:35:00.000Z\"}",
      "generatedAt": "2025-08-21T10:35:00.000Z"
    }
  },
  "message": "Booking confirmed successfully"
}
```

### Cancel Booking
**PATCH** `/bookings/{bookingId}/cancel` 🔒

Cancel a booking (must be done at least 24 hours before event).

**Request Body:**
```json
{
  "reason": "Unable to attend due to schedule conflict"
}
```

### Check In Booking
**PATCH** `/bookings/{bookingId}/checkin` 🔒

Check in a booking at the event (organizer/admin only).

### Validate QR Code
**POST** `/bookings/validate-qr` 🔒

Validate a QR code for event entry.

**Request Body:**
```json
{
  "qrData": "{\"bookingId\":\"BK-001-2025\",\"eventId\":\"64a1b2c3d4e5f6789012345b\",\"timestamp\":\"2025-08-21T10:30:00.000Z\"}",
  "eventId": "64a1b2c3d4e5f6789012345b"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "booking": {
      "bookingId": "BK-001-2025",
      "attendeeName": "John Doe",
      "eventName": "Tech Innovation Summit 2025",
      "seats": ["A1", "A2"],
      "totalAmount": 300,
      "isCheckedIn": false,
      "checkInTime": null
    }
  },
  "message": "QR code validated successfully"
}
```

### Get Event Bookings
**GET** `/bookings/event/{eventId}` 🔒

Get all bookings for a specific event (organizer/admin only).

---

## 📊 Analytics Dashboard

### Get Dashboard Analytics
**GET** `/analytics/dashboard` 🔒

Get comprehensive analytics for event organizer.

**Query Parameters:**
- `startDate` (date): Start date for analytics period
- `endDate` (date): End date for analytics period

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalEvents": 5,
    "activeEvents": 3,
    "totalBookings": 150,
    "totalRevenue": 22500,
    "currency": "USD",
    "upcomingEvents": 2,
    "recentBookings": [
      {
        "_id": "64a1b2c3d4e5f6789012345c",
        "bookingId": "BK-001-2025",
        "eventName": "Tech Innovation Summit 2025",
        "amount": 300,
        "status": "confirmed",
        "date": "2025-08-21T10:30:00.000Z"
      }
    ],
    "eventAnalytics": {
      "totalViews": 1250,
      "conversionRate": 12.5,
      "averageTicketPrice": 150,
      "topCategories": ["Technology", "Music", "Sports"]
    },
    "bookingTrends": [
      {
        "date": "2025-08-21",
        "bookings": 25,
        "revenue": 3750
      }
    ]
  },
  "message": "Analytics data retrieved successfully"
}
```

### Get Event Analytics
**GET** `/analytics/events/{eventId}` 🔒

Get detailed analytics for a specific event.

### Get Booking Analytics
**GET** `/bookings/analytics/summary` 🔒

Get booking analytics summary with trends.

---

## 👤 User Management

### Get All Users
**GET** `/users` 🔒 (Admin only)

Get all users with pagination and filtering.

### Get User by ID
**GET** `/users/{userId}` 🔒

Get user details by ID.

### Update User Profile
**PUT** `/users/{userId}` 🔒

Update user profile information.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "profileDetails": {
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    },
    "interests": ["Technology", "Music", "Sports"]
  }
}
```

### Delete User
**DELETE** `/users/{userId}` 🔒

Delete user account (admin only or self).

---

## ⚠️ Error Handling

All API responses follow a consistent error format:

**Error Response Structure:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "type": "field",
      "msg": "Validation error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

**Common Error Types:**
- **Validation Errors**: Invalid input data
- **Authentication Errors**: Missing or invalid JWT token
- **Authorization Errors**: Insufficient permissions
- **Not Found Errors**: Resource does not exist
- **Conflict Errors**: Resource already exists or constraint violation

---

## 📋 Status Codes

- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Validation errors or malformed requests
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Access denied (insufficient permissions)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side errors

---

## 🚦 Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Rate Limit**: 100 requests per 15 minutes per IP
- **Authentication Endpoints**: Additional restrictions may apply
- **Rate Limit Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 🔧 Environment Variables

Required environment variables for setup:

```env
NODE_ENV=development
PORT=5003

# MongoDB Configuration
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventx-studio

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Getting Started

1. **Setup Environment**:
   ```bash
   npm install
   cp .env.example .env
   # Configure your environment variables
   ```

2. **Start Server**:
   ```bash
   npm start
   # Server will run on http://localhost:5003
   ```

3. **Test API**:
   ```bash
   # Health check
   curl http://localhost:5003/api/health
   ```

4. **Import Postman Collection**:
   - Import `EventX_Studio_API_Complete.postman_collection.json`
   - Set environment variables
   - Start testing!

---

## 📞 Support

For API support and questions:
- **Email**: support@eventxstudio.com
- **Documentation**: This file
- **Postman Collection**: Complete API testing collection included

---

**Last Updated**: August 21, 2025  
**API Version**: v1.0.0  
**Status**: ✅ Production Ready
