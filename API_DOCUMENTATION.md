# EventX Studio - API Documentation

## Base URL
```
Production: https://eventx-studio-api.render.com/api
Development: http://localhost:5000/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Register a new user
```
POST /auth/register
```

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "createdAt": "2025-08-20T12:00:00Z"
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "lastLogin": "2025-09-03T12:00:00Z"
  }
}
```

#### Forgot Password
```
POST /auth/forgot-password
```

**Request Body**
```json
{
  "email": "john.doe@example.com"
}
```

**Response**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### Reset Password
```
POST /auth/reset-password
```

**Request Body**
```json
{
  "token": "reset-token",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## User Management

### User Endpoints

#### Get Current User
```
GET /users/me
```

**Response**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "profileDetails": {
      "phone": "1234567890",
      "dateOfBirth": "1990-01-01T00:00:00Z",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001"
      }
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLogin": "2025-09-03T12:00:00Z"
  }
}
```

#### Get All Users (Admin Only)
```
GET /users
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)
- `search`: Search term for name or email

**Response**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "current": 1,
    "total": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "users": [
    {
      "id": "user-id-1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLogin": "2025-09-03T12:00:00Z"
    },
    // More users...
  ]
}
```

#### Get User by ID (Admin Only)
```
GET /users/:id
```

**Response**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "profileDetails": {
      "phone": "1234567890",
      "dateOfBirth": "1990-01-01T00:00:00Z",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001"
      }
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLogin": "2025-09-03T12:00:00Z",
    "stats": {
      "eventsCreated": 5,
      "bookingsMade": 10,
      "totalSpent": 250.00
    }
  }
}
```

#### Update User Profile
```
PUT /users/update-profile
```

**Request Body**
```json
{
  "name": "John Updated",
  "profileDetails": {
    "phone": "9876543210",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "456 New St",
      "city": "Chicago",
      "state": "IL",
      "country": "USA",
      "postalCode": "60007"
    }
  }
}
```

**Response**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user-id",
    "name": "John Updated",
    "email": "john.doe@example.com",
    "profileDetails": {
      "phone": "9876543210",
      "dateOfBirth": "1990-01-01T00:00:00Z",
      "address": {
        "street": "456 New St",
        "city": "Chicago",
        "state": "IL",
        "country": "USA",
        "postalCode": "60007"
      }
    }
  }
}
```

#### Update User Role (Admin Only)
```
PUT /users/:id/role
```

**Request Body**
```json
{
  "role": "admin"
}
```

**Response**
```json
{
  "success": true,
  "message": "User role updated successfully"
}
```

---

## Event Management

### Event Endpoints

#### Create Event
```
POST /events
```

**Request Body**
```json
{
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "venue": {
    "name": "Tech Convention Center",
    "address": "123 Tech Blvd",
    "city": "San Francisco",
    "country": "USA",
    "coordinates": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "startDateTime": "2025-12-01T09:00:00Z",
  "endDateTime": "2025-12-03T17:00:00Z",
  "category": "Technology",
  "capacity": 500,
  "ticketPrice": 99.99,
  "isPublished": true,
  "tags": ["tech", "conference", "innovation"],
  "featuredImage": "https://example.com/image.jpg"
}
```

**Response**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": "event-id",
    "name": "Tech Conference 2025",
    "description": "Annual technology conference",
    "venue": {
      "name": "Tech Convention Center",
      "address": "123 Tech Blvd",
      "city": "San Francisco",
      "country": "USA",
      "coordinates": {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    },
    "startDateTime": "2025-12-01T09:00:00Z",
    "endDateTime": "2025-12-03T17:00:00Z",
    "category": "Technology",
    "capacity": 500,
    "availableSeats": 500,
    "ticketPrice": 99.99,
    "isPublished": true,
    "status": "upcoming",
    "tags": ["tech", "conference", "innovation"],
    "featuredImage": "https://example.com/image.jpg",
    "createdBy": "user-id",
    "createdAt": "2025-09-03T12:00:00Z"
  }
}
```

#### Get All Events
```
GET /events
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field (default: startDateTime)
- `order`: Sort order (asc/desc, default: asc)
- `search`: Search term for name or description
- `category`: Filter by category
- `status`: Filter by status (upcoming, active, past, cancelled)
- `startDate`: Filter events starting after this date
- `endDate`: Filter events ending before this date

**Response**
```json
{
  "success": true,
  "count": 35,
  "pagination": {
    "current": 1,
    "total": 4,
    "hasNext": true,
    "hasPrev": false
  },
  "events": [
    {
      "id": "event-id-1",
      "name": "Tech Conference 2025",
      "description": "Annual technology conference",
      "startDateTime": "2025-12-01T09:00:00Z",
      "endDateTime": "2025-12-03T17:00:00Z",
      "venue": {
        "name": "Tech Convention Center",
        "city": "San Francisco"
      },
      "category": "Technology",
      "capacity": 500,
      "availableSeats": 480,
      "ticketPrice": 99.99,
      "status": "upcoming",
      "featuredImage": "https://example.com/image.jpg"
    },
    // More events...
  ]
}
```

#### Get Event by ID
```
GET /events/:id
```

**Response**
```json
{
  "success": true,
  "event": {
    "id": "event-id",
    "name": "Tech Conference 2025",
    "description": "Annual technology conference",
    "venue": {
      "name": "Tech Convention Center",
      "address": "123 Tech Blvd",
      "city": "San Francisco",
      "country": "USA",
      "coordinates": {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    },
    "startDateTime": "2025-12-01T09:00:00Z",
    "endDateTime": "2025-12-03T17:00:00Z",
    "category": "Technology",
    "capacity": 500,
    "availableSeats": 480,
    "ticketPrice": 99.99,
    "isPublished": true,
    "status": "upcoming",
    "tags": ["tech", "conference", "innovation"],
    "featuredImage": "https://example.com/image.jpg",
    "createdBy": {
      "id": "user-id",
      "name": "John Doe"
    },
    "createdAt": "2025-09-03T12:00:00Z",
    "updatedAt": "2025-09-03T12:00:00Z",
    "bookingStats": {
      "totalBookings": 20,
      "revenue": 1999.80,
      "checkIns": 0
    }
  }
}
```

#### Update Event
```
PUT /events/:id
```

**Request Body** (any fields that need updating)
```json
{
  "name": "Updated Tech Conference 2025",
  "capacity": 600,
  "ticketPrice": 129.99
}
```

**Response**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": {
    "id": "event-id",
    "name": "Updated Tech Conference 2025",
    "capacity": 600,
    "ticketPrice": 129.99,
    // Other event fields...
  }
}
```

#### Delete Event
```
DELETE /events/:id
```

**Response**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### Cancel Event
```
PUT /events/:id/cancel
```

**Request Body**
```json
{
  "cancellationReason": "Venue unavailability"
}
```

**Response**
```json
{
  "success": true,
  "message": "Event cancelled successfully"
}
```

---

## Booking Management

### Booking Endpoints

#### Create Booking
```
POST /bookings
```

**Request Body**
```json
{
  "eventId": "event-id",
  "tickets": [
    {
      "attendeeName": "John Doe",
      "attendeeEmail": "john.doe@example.com",
      "attendeePhone": "1234567890"
    },
    {
      "attendeeName": "Jane Smith",
      "attendeeEmail": "jane.smith@example.com",
      "attendeePhone": "0987654321"
    }
  ],
  "paymentInfo": {
    "method": "credit_card",
    "transactionId": "payment-id-123"
  }
}
```

**Response**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-id",
    "referenceNumber": "EVX-20250903-123456",
    "event": {
      "id": "event-id",
      "name": "Tech Conference 2025"
    },
    "user": {
      "id": "user-id",
      "name": "John Doe"
    },
    "tickets": [
      {
        "id": "ticket-id-1",
        "attendeeName": "John Doe",
        "attendeeEmail": "john.doe@example.com",
        "attendeePhone": "1234567890",
        "qrCode": "https://api.eventx-studio.com/qr/ticket-id-1"
      },
      {
        "id": "ticket-id-2",
        "attendeeName": "Jane Smith",
        "attendeeEmail": "jane.smith@example.com",
        "attendeePhone": "0987654321",
        "qrCode": "https://api.eventx-studio.com/qr/ticket-id-2"
      }
    ],
    "totalAmount": 199.98,
    "status": "confirmed",
    "createdAt": "2025-09-03T12:00:00Z"
  }
}
```

#### Get User Bookings
```
GET /bookings/my-bookings
```

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `status`: Filter by status (confirmed, cancelled, completed)
- `eventId`: Filter by specific event

**Response**
```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "current": 1,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "bookings": [
    {
      "id": "booking-id-1",
      "referenceNumber": "EVX-20250903-123456",
      "event": {
        "id": "event-id",
        "name": "Tech Conference 2025",
        "startDateTime": "2025-12-01T09:00:00Z",
        "endDateTime": "2025-12-03T17:00:00Z",
        "venue": {
          "name": "Tech Convention Center",
          "city": "San Francisco"
        }
      },
      "totalTickets": 2,
      "totalAmount": 199.98,
      "status": "confirmed",
      "createdAt": "2025-09-03T12:00:00Z"
    },
    // More bookings...
  ]
}
```

#### Get Booking by ID
```
GET /bookings/:id
```

**Response**
```json
{
  "success": true,
  "booking": {
    "id": "booking-id",
    "referenceNumber": "EVX-20250903-123456",
    "event": {
      "id": "event-id",
      "name": "Tech Conference 2025",
      "startDateTime": "2025-12-01T09:00:00Z",
      "endDateTime": "2025-12-03T17:00:00Z",
      "venue": {
        "name": "Tech Convention Center",
        "address": "123 Tech Blvd",
        "city": "San Francisco",
        "country": "USA"
      }
    },
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "tickets": [
      {
        "id": "ticket-id-1",
        "attendeeName": "John Doe",
        "attendeeEmail": "john.doe@example.com",
        "attendeePhone": "1234567890",
        "qrCode": "https://api.eventx-studio.com/qr/ticket-id-1",
        "checkedIn": false
      },
      {
        "id": "ticket-id-2",
        "attendeeName": "Jane Smith",
        "attendeeEmail": "jane.smith@example.com",
        "attendeePhone": "0987654321",
        "qrCode": "https://api.eventx-studio.com/qr/ticket-id-2",
        "checkedIn": false
      }
    ],
    "totalAmount": 199.98,
    "status": "confirmed",
    "paymentInfo": {
      "method": "credit_card",
      "transactionId": "payment-id-123",
      "date": "2025-09-03T12:00:00Z"
    },
    "createdAt": "2025-09-03T12:00:00Z"
  }
}
```

#### Cancel Booking
```
PUT /bookings/:id/cancel
```

**Response**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

#### Check-in Ticket
```
PUT /bookings/ticket/:ticketId/check-in
```

**Response**
```json
{
  "success": true,
  "message": "Ticket checked in successfully",
  "ticket": {
    "id": "ticket-id-1",
    "attendeeName": "John Doe",
    "checkedIn": true,
    "checkedInAt": "2025-12-01T09:30:00Z"
  }
}
```

---

## Analytics

### Analytics Endpoints (Admin Only)

#### Get Dashboard Overview
```
GET /analytics/dashboard
```

**Response**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalEvents": 78,
    "totalBookings": 3560,
    "totalRevenue": 256480.50,
    "recentActivity": {
      "newUsers": 45,
      "newEvents": 12,
      "newBookings": 156
    },
    "topEvents": [
      {
        "id": "event-id-1",
        "name": "Tech Conference 2025",
        "bookings": 480,
        "revenue": 47982.00
      },
      // More events...
    ],
    "userGrowth": [
      { "month": "Jan", "users": 980 },
      { "month": "Feb", "users": 1020 },
      // More months...
    ],
    "revenueByMonth": [
      { "month": "Jan", "revenue": 18500.00 },
      { "month": "Feb", "revenue": 22350.00 },
      // More months...
    ]
  }
}
```

#### Get Event Analytics
```
GET /analytics/events/:id
```

**Response**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "event-id",
      "name": "Tech Conference 2025"
    },
    "totalBookings": 480,
    "totalRevenue": 47982.00,
    "attendance": {
      "total": 350,
      "percentage": 72.9
    },
    "ticketsSold": {
      "daily": [
        { "date": "2025-08-01", "count": 45 },
        { "date": "2025-08-02", "count": 32 },
        // More dates...
      ]
    },
    "demographics": {
      "gender": [
        { "type": "Male", "count": 280 },
        { "type": "Female", "count": 190 },
        { "type": "Other", "count": 10 }
      ],
      "age": [
        { "range": "18-24", "count": 95 },
        { "range": "25-34", "count": 210 },
        { "range": "35-44", "count": 120 },
        { "range": "45+", "count": 55 }
      ],
      "location": [
        { "city": "San Francisco", "count": 180 },
        { "city": "Oakland", "count": 85 },
        { "city": "San Jose", "count": 65 },
        { "city": "Other", "count": 150 }
      ]
    }
  }
}
```

#### Get Attendee Analytics
```
GET /analytics/attendees
```

**Query Parameters**
- `startDate`: Filter data from this date
- `endDate`: Filter data to this date
- `eventId`: Filter by specific event

**Response**
```json
{
  "success": true,
  "data": {
    "totalAttendees": 3560,
    "demographics": {
      "gender": [
        { "type": "Male", "count": 1850 },
        { "type": "Female", "count": 1650 },
        { "type": "Other", "count": 60 }
      ],
      "age": [
        { "range": "18-24", "count": 785 },
        { "range": "25-34", "count": 1560 },
        { "range": "35-44", "count": 850 },
        { "range": "45+", "count": 365 }
      ],
      "location": [
        { "city": "San Francisco", "count": 980 },
        { "city": "Oakland", "count": 540 },
        { "city": "San Jose", "count": 485 },
        { "city": "Other", "count": 1555 }
      ]
    },
    "interests": [
      { "category": "Technology", "count": 1850 },
      { "category": "Business", "count": 950 },
      { "category": "Entertainment", "count": 650 },
      { "category": "Other", "count": 110 }
    ],
    "attendance": {
      "firstTime": 1250,
      "returning": 2310
    }
  }
}
```

#### Get Revenue Analytics
```
GET /analytics/revenue
```

**Query Parameters**
- `startDate`: Filter data from this date
- `endDate`: Filter data to this date
- `groupBy`: Group data by (day, week, month, year)

**Response**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 256480.50,
    "averageTicketPrice": 72.05,
    "revenueByPeriod": [
      { "period": "Jan 2025", "revenue": 18500.00 },
      { "period": "Feb 2025", "revenue": 22350.00 },
      // More periods...
    ],
    "revenueByCategory": [
      { "category": "Technology", "revenue": 120500.00 },
      { "category": "Business", "revenue": 85600.00 },
      { "category": "Entertainment", "revenue": 42300.00 },
      { "category": "Other", "revenue": 8080.50 }
    ],
    "topPerformingEvents": [
      {
        "id": "event-id-1",
        "name": "Tech Conference 2025",
        "revenue": 47982.00
      },
      // More events...
    ]
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: Authentication issues
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RESOURCE_CONFLICT`: Resource already exists
- `SERVER_ERROR`: Internal server error

### HTTP Status Codes
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication issues)
- `403`: Forbidden (permission issues)
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error
