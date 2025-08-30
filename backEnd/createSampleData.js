const mongoose = require('mongoose');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventx-studio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create sample data
const createSampleData = async () => {
  try {
    // Create a sample user if it doesn't exist
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      user = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        profileDetails: {
          gender: 'male',
          dateOfBirth: new Date('1990-01-01'),
          location: 'Colombo',
          interests: ['Music', 'Technology']
        }
      });
      await user.save();
      console.log('✅ Sample user created');
    }

    // Create sample events
    const events = [
      {
        name: 'Music Festival 2025',
        description: 'Amazing music festival with top artists',
        date: new Date('2025-04-15T18:00:00Z'),
        venue: { name: 'National Stadium', city: 'Colombo', address: '123 Main St' },
        category: 'Music',
        ticketPrice: 50,
        totalSeats: 1000,
        organizer: user._id,
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'Tech Conference 2025',
        description: 'Latest technology trends and innovations',
        date: new Date('2025-05-20T09:00:00Z'),
        venue: { name: 'Convention Center', city: 'Kandy', address: '456 Tech Ave' },
        category: 'Technology',
        ticketPrice: 75,
        totalSeats: 500,
        organizer: user._id,
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'Art Exhibition',
        description: 'Contemporary art showcase',
        date: new Date('2025-06-10T10:00:00Z'),
        venue: { name: 'Art Gallery', city: 'Galle', address: '789 Art St' },
        category: 'Art',
        ticketPrice: 25,
        totalSeats: 200,
        organizer: user._id,
        status: 'upcoming',
        isActive: true
      }
    ];

    // Clear existing events and create new ones
    await Event.deleteMany({ organizer: user._id });
    const createdEvents = await Event.insertMany(events);
    console.log('✅ Sample events created:', createdEvents.length);

    // Create sample bookings
    const bookings = [];
    const now = new Date();
    const dates = [
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      new Date() // today
    ];

    for (let i = 0; i < createdEvents.length; i++) {
      const event = createdEvents[i];
      for (let j = 0; j < 5; j++) {
        bookings.push({
          user: user._id,
          event: event._id,
          seats: [`A${j+1}`],
          totalAmount: event.ticketPrice,
          status: 'confirmed',
          bookingDate: dates[j % dates.length]
        });
      }
    }

    // Clear existing bookings and create new ones
    await Booking.deleteMany({});
    await Booking.insertMany(bookings);
    console.log('✅ Sample bookings created:', bookings.length);

    console.log('🎉 Sample data creation completed!');
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createSampleData();
  process.exit(0);
};

run();
