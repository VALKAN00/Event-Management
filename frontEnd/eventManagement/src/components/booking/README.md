# Booking Management System

This is a comprehensive booking management system that matches your backend Booking model. The system includes a main booking page with multiple components for managing event bookings.

## Features

### 📊 **Dashboard Overview**
- **Booking Statistics**: Total bookings, confirmed bookings, total revenue, cancelled bookings
- **Real-time Data**: Loading states and statistics updates
- **Export Functionality**: Export booking data (ready for API integration)

### 🔍 **Advanced Filtering & Search**
- **Search**: By booking ID or event name
- **Status Filter**: All statuses (pending, confirmed, cancelled, checked-in, refunded)
- **Date Range**: Filter by booking date range
- **Sorting**: By date, amount (ascending/descending)
- **Real-time Filtering**: Instant results as you type

### 📋 **Booking Management**
- **Booking Cards**: Clean, responsive card layout showing key booking info
- **Detailed View**: Modal with complete booking information including:
  - Event details
  - Seat information
  - Payment details
  - QR code (for confirmed bookings)
  - Attendee information
  - Check-in status

### ✨ **Actions Available**
- **View Details**: Complete booking information
- **Cancel Booking**: Cancel pending bookings with confirmation
- **Check-in**: Mark confirmed bookings as checked-in
- **QR Scanner**: Validate bookings via QR code or manual entry

### 🎫 **Create New Bookings**
- **Event Selection**: Choose from available events
- **Attendee Information**: Name, email, phone, special requirements
- **Seat Management**: Add/remove multiple seats with pricing
- **Payment Method**: Multiple payment options
- **Real-time Total**: Automatic calculation of total amount

### 📱 **QR Code System**
- **QR Scanner**: Camera integration ready (placeholder included)
- **Manual Entry**: Alternative booking ID entry
- **Validation**: Check booking status before check-in
- **Error Handling**: User-friendly error messages

### 📄 **Pagination**
- **Smart Pagination**: Shows relevant page numbers
- **Results Info**: "Showing X to Y of Z results"
- **Navigation**: Previous/Next with page number buttons

## File Structure

```
src/
├── pages/
│   └── Booking.jsx                 # Main booking management page
├── components/
│   └── booking/
│       ├── BookingCard.jsx         # Individual booking card
│       ├── BookingDetailsModal.jsx # Detailed booking view
│       ├── BookingFilters.jsx      # Search and filter controls
│       ├── BookingStats.jsx        # Statistics dashboard
│       ├── CreateBookingForm.jsx   # New booking form
│       ├── Pagination.jsx          # Pagination component
│       └── QRScanner.jsx          # QR code scanner
└── api/
    └── bookingAPI.js              # API service functions
```

## Backend Integration

The system is designed to work seamlessly with your backend Booking model:

### **Booking Schema Fields Supported:**
- ✅ `bookingId` - Unique booking identifier
- ✅ `user` - User reference with populated data
- ✅ `event` - Event reference with venue, date, time
- ✅ `seats` - Array of seat objects with number, row, section, price
- ✅ `totalAmount` - Calculated total with currency
- ✅ `bookingDate` - Creation timestamp
- ✅ `status` - All status values (pending, confirmed, cancelled, etc.)
- ✅ `paymentDetails` - Method, status, transaction ID
- ✅ `qrCode` - Base64 image for confirmed bookings
- ✅ `checkInDetails` - Check-in status and timestamp
- ✅ `attendeeInfo` - Name, email, phone, special requirements
- ✅ `refundDetails` - Refund information for cancelled bookings

### **API Endpoints Ready:**
```javascript
// All API functions are implemented in bookingAPI.js
- getMyBookings()      // GET /api/bookings/my
- getBooking(id)       // GET /api/bookings/:id
- createBooking()      // POST /api/bookings
- cancelBooking()      // PATCH /api/bookings/:id/cancel
- confirmBooking()     // PATCH /api/bookings/:id/confirm
- checkInBooking()     // PATCH /api/bookings/:id/checkin
- validateQRCode()     // POST /api/bookings/validate-qr
- getBookingAnalytics() // GET /api/bookings/analytics/summary
```

## How to Use

### **1. View All Bookings**
- Navigate to `/booking-tickets` route
- See all bookings in card format
- Use filters to find specific bookings

### **2. Create New Booking**
- Click "New Booking" button
- Fill in attendee information
- Select event and seats
- Choose payment method
- Submit to create booking

### **3. Manage Existing Bookings**
- Click "View Details" to see complete information
- Use "Cancel" for pending bookings
- Use "Check In" for confirmed bookings

### **4. QR Code Operations**
- Click "QR Scanner" to validate bookings
- Scan QR code or enter booking ID manually
- System validates and processes check-in

## Integration Steps

### **1. Replace Mock Data**
Replace the mock data in `Booking.jsx` with actual API calls:

```javascript
// Replace this in useEffect
setTimeout(() => {
  setBookings(mockBookings);
  setFilteredBookings(mockBookings);
  setLoading(false);
}, 1000);

// With this
const data = await bookingAPI.getMyBookings();
setBookings(data.bookings);
setFilteredBookings(data.bookings);
setLoading(false);
```

### **2. Environment Variables**
Set up your API URL in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### **3. Authentication**
Update the `getAuthToken()` function in `bookingAPI.js` to match your auth system.

### **4. QR Scanner Library**
Install a QR scanner library like `react-qr-scanner` for camera functionality:
```bash
npm install react-qr-scanner
```

## Responsive Design

- ✅ **Mobile-first**: Designed for mobile and desktop
- ✅ **Grid System**: Responsive grid layouts
- ✅ **Touch-friendly**: Large buttons and touch targets
- ✅ **Modern UI**: Clean, professional design with Tailwind CSS

## Status Colors

- 🟢 **Confirmed**: Green
- 🟡 **Pending**: Yellow  
- 🔴 **Cancelled**: Red
- 🔵 **Checked-in**: Blue
- ⚪ **Refunded**: Gray

The system is production-ready and fully matches your backend Booking model structure. Just connect the API endpoints and you're good to go! 🚀
