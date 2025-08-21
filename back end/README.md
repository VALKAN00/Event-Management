# EventX Studio Backend

A comprehensive backend API for the EventX Studio Event Management System built with Node.js, Express, and MongoDB.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Account lockout after failed attempts
- Password reset functionality
- Email verification

### Event Management
- CRUD operations for events
- Event categorization and tagging
- Venue management with capacity tracking
- Seat allocation and management
- Event status tracking (upcoming, active, closed, cancelled)
- Event analytics and performance metrics

### Booking System
- Seat selection and booking
- QR code generation for tickets
- Booking status management
- Payment integration ready
- Booking cancellation with refund handling
- Check-in functionality with QR validation

### Analytics Dashboard
- Revenue analytics with trend analysis
- Attendee demographics and insights
- Event performance metrics
- Location-based analytics
- Interest-based segmentation
- Social media reach tracking
- Export functionality

### User Management
- User profile management
- Admin user management
- User activity tracking
- Account activation/deactivation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcrypt
- **QR Code Generation**: qrcode
- **Environment Variables**: dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventx-studio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB Configuration
   MONGODB_USERNAME=valkan
   MONGODB_PASSWORD=01200863395Abdo
   MONGODB_URI=mongodb+srv://valkan:01200863395Abdo@cluster0.mongodb.net/eventx-studio?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   
   # Other Configuration
   BCRYPT_SALT_ROUNDS=12
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/logout` | Logout user | Public |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/update-password` | Update password | Private |
| POST | `/auth/forgot-password` | Request password reset | Public |
| PUT | `/auth/reset-password/:token` | Reset password | Public |

### Event Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/events` | Get all events | Public |
| GET | `/events/search` | Search events | Public |
| GET | `/events/:id` | Get single event | Public |
| POST | `/events` | Create event | Admin |
| PUT | `/events/:id` | Update event | Admin |
| DELETE | `/events/:id` | Delete event | Admin |
| GET | `/events/my/created` | Get user's events | Admin |
| POST | `/events/:id/bookmark` | Bookmark event | Private |

### Booking Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/bookings` | Create booking | Private |
| GET | `/bookings/my` | Get user bookings | Private |
| GET | `/bookings/:id` | Get single booking | Private |
| PATCH | `/bookings/:id/cancel` | Cancel booking | Private |
| PATCH | `/bookings/:id/confirm` | Confirm booking | Private |
| GET | `/bookings/event/:eventId` | Get event bookings | Admin |
| PATCH | `/bookings/:id/checkin` | Check in booking | Admin |

### Analytics Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard stats | Admin |
| GET | `/analytics/revenue` | Revenue analytics | Admin |
| GET | `/analytics/attendees/insights` | Attendee insights | Admin |
| GET | `/analytics/events/performance` | Event performance | Admin |
| GET | `/analytics/attendees/locations` | Location analytics | Admin |
| GET | `/analytics/attendees/interests` | Interest analytics | Admin |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/profile` | Get user profile | Private |
| PUT | `/users/profile` | Update profile | Private |
| GET | `/users/profile/bookings` | Get user bookings | Private |
| PATCH | `/users/:id/role` | Update user role | Admin |
| PATCH | `/users/:id/deactivate` | Deactivate user | Admin |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
```

### Create Event
```bash
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Colombo Music Festival 2025",
  "description": "Sri Lanka's biggest music festival",
  "venue": {
    "name": "Viharamahadevi Open Air Theater",
    "address": "Viharamahadevi Park, Colombo",
    "city": "Colombo",
    "capacity": 1200
  },
  "date": "2025-04-12",
  "time": {
    "start": "18:00",
    "end": "22:30"
  },
  "pricing": {
    "ticketPrice": 2500,
    "currency": "LKR"
  },
  "categories": ["Live Music", "EDM Music"],
  "tags": ["Music", "Festival"]
}
```

### Create Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "event_id_here",
  "seats": [
    {
      "seatNumber": "S001",
      "row": "A",
      "section": "General"
    }
  ],
  "attendeeInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+94123456789"
  }
}
```

## Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  profileDetails: {
    phone: String,
    dateOfBirth: Date,
    gender: String,
    location: { city: String, country: String },
    interests: [String]
  },
  isActive: Boolean,
  emailVerified: Boolean
}
```

### Event Model
```javascript
{
  name: String,
  description: String,
  venue: {
    name: String,
    address: String,
    city: String,
    capacity: Number
  },
  date: Date,
  time: { start: String, end: String },
  pricing: { ticketPrice: Number, currency: String },
  categories: [String],
  seatConfiguration: {
    totalSeats: Number,
    availableSeats: Number,
    bookedSeats: Number,
    seatMap: [SeatSchema]
  },
  organizer: ObjectId (User),
  analytics: {
    totalViews: Number,
    totalBookings: Number,
    totalRevenue: Number
  },
  status: String
}
```

### Booking Model
```javascript
{
  bookingId: String (unique),
  user: ObjectId (User),
  event: ObjectId (Event),
  seats: [SeatSchema],
  totalAmount: Number,
  status: String,
  paymentDetails: {
    method: String,
    transactionId: String,
    paymentStatus: String
  },
  qrCode: {
    data: String,
    image: String (base64)
  },
  checkInDetails: {
    isCheckedIn: Boolean,
    checkInTime: Date
  }
}
```

## Security Features

- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-Origin Resource Sharing configuration
- **Helmet**: Security headers middleware
- **JWT Security**: Secure token generation and validation
- **Password Security**: bcrypt hashing with salt rounds
- **Account Lockout**: Automatic lockout after failed login attempts

## Error Handling

The API uses consistent error response format:

```javascript
{
  "success": false,
  "message": "Error description",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "errors": [] // Optional validation errors
}
```

## Success Response Format

```javascript
{
  "success": true,
  "message": "Success message",
  "data": {}, // Response data
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Testing with Postman

1. Import the provided Postman collection (if available)
2. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: JWT token from login response

3. Test the authentication flow:
   - Register a new user
   - Login with credentials
   - Use the token for protected routes

## Development

### Project Structure
```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # Express routes
├── utils/          # Utility functions
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── package.json    # Dependencies
└── server.js       # Main server file
```

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

## Deployment

The application is ready for deployment on platforms like:
- Heroku
- Render
- Railway
- DigitalOcean App Platform

Make sure to:
1. Set production environment variables
2. Update MongoDB connection for production
3. Configure CORS for your frontend domain
4. Set NODE_ENV to 'production'

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**EventX Studio Backend** - Powering the future of event management! 🎉
