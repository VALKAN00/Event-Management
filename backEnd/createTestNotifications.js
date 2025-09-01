require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// Import models
const Notification = require('./models/Notification');
const User = require('./models/User');

const createTestNotifications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the first user to create notifications for
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`📝 Creating notifications for user: ${user.name}`);

    // Delete existing notifications for this user
    await Notification.deleteMany({ userId: user._id });
    console.log('🗑️ Cleared existing notifications');

    // Create test notifications
    const testNotifications = [
      {
        userId: user._id,
        title: '🎪 Welcome to EventX Studio!',
        message: 'Your account has been set up successfully. Start creating amazing events!',
        type: 'event_created',
        priority: 'medium',
        read: false
      },
      {
        userId: user._id,
        title: '🎫 Event Reminder',
        message: 'Your event "Tech Conference 2025" is starting in 2 hours. Make sure everything is ready!',
        type: 'event_upcoming',
        priority: 'high',
        read: false
      },
      {
        userId: user._id,
        title: '📅 New Booking Received',
        message: 'You have received a new booking for "Music Festival". 3 tickets reserved.',
        type: 'booking_created',
        priority: 'high',
        read: true
      },
      {
        userId: user._id,
        title: '⏰ Upcoming Events This Week',
        message: 'You have 2 events scheduled for this week. Check your dashboard for details.',
        type: 'event_upcoming',
        priority: 'medium',
        read: false
      },
      {
        userId: user._id,
        title: '🎉 Event Successfully Created',
        message: 'Your event "Workshop Series" has been published and is now live for bookings!',
        type: 'event_created',
        priority: 'medium',
        read: true
      }
    ];

    // Insert notifications
    await Notification.insertMany(testNotifications);

    console.log(`✅ Created ${testNotifications.length} test notifications`);
    console.log(`📊 Unread count: ${testNotifications.filter(n => !n.read).length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
    process.exit(1);
  }
};

createTestNotifications();
