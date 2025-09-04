const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Event = require('./models/Event');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventx_studio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const generateBookingId = () => {
  return 'BOOK' + Date.now() + Math.floor(Math.random() * 1000);
};

const seedBookingsWithGender = async () => {
  try {
    console.log('🌱 Starting to seed bookings with gender data...');
    
    // Get all users and events
    const users = await User.find({});
    const events = await Event.find({});
    
    if (users.length === 0 || events.length === 0) {
      console.log(' No users or events found. Please seed users and events first.');
      return;
    }

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log(' Cleared existing bookings');

    const genders = ['Male', 'Female'];
    const paymentMethods = ['card', 'mobile', 'bank_transfer', 'cash'];
    const statuses = ['confirmed', 'pending', 'checked-in'];

    const sampleBookings = [];

    // Create 15 sample bookings with gender data
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const booking = {
        bookingId: generateBookingId(),
        user: randomUser._id,
        event: randomEvent._id,
        seats: [{
          seatNumber: `A${i + 1}`,
          row: 'A',
          section: 'General',
          price: Math.floor(Math.random() * 5000) + 1000 // Random price between 1000-6000 LKR
        }],
        totalAmount: Math.floor(Math.random() * 5000) + 1000,
        currency: 'LKR',
        bookingDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in last 30 days
        status: randomStatus,
        paymentDetails: {
          method: randomPaymentMethod,
          transactionId: `TXN${Date.now()}${i}`,
          paymentStatus: randomStatus === 'confirmed' ? 'completed' : 'pending',
          paymentDate: new Date()
        },
        attendeeInfo: {
          name: randomUser.name,
          email: randomUser.email,
          phone: `+94${Math.floor(Math.random() * 100000000).toString().padStart(9, '0')}`,
          gender: randomGender,
          specialRequirements: i % 3 === 0 ? 'Vegetarian meal preferred' : ''
        },
        notifications: {
          emailSent: true,
          smsSent: false,
          reminderSent: false
        }
      };

      sampleBookings.push(booking);
    }

    // Insert bookings
    const createdBookings = await Booking.insertMany(sampleBookings);
    console.log(` Created ${createdBookings.length} sample bookings with gender data`);

    // Display summary
    const genderCounts = sampleBookings.reduce((acc, booking) => {
      const gender = booking.attendeeInfo.gender;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    console.log(' Gender Distribution:');
    Object.entries(genderCounts).forEach(([gender, count]) => {
      console.log(`   ${gender}: ${count} bookings`);
    });

    console.log(' Booking seeding with gender data completed successfully!');
    
  } catch (error) {
    console.error(' Error seeding bookings:', error);
  } finally {
    await mongoose.connection.close();
    console.log(' Database connection closed');
  }
};

// Run the seeding
connectDB().then(() => {
  seedBookingsWithGender();
});
