const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');

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

const checkInterestsData = async () => {
  try {
    console.log('🔍 Checking interests data...');
    
    // Check users with interests
    const usersWithInterests = await User.find({
      'profileDetails.interests': { $exists: true, $ne: [] }
    });
    
    console.log(`\n📊 Users with interests: ${usersWithInterests.length}`);
    usersWithInterests.forEach(user => {
      console.log(`   ${user.name}: ${user.profileDetails.interests.join(', ')}`);
    });
    
    // Check all bookings
    const bookings = await Booking.find({}).populate('user');
    console.log(`\n📋 Total bookings: ${bookings.length}`);
    
    // Check which bookings have users with interests
    let bookingsWithInterests = 0;
    bookings.forEach(booking => {
      if (booking.user && booking.user.profileDetails?.interests?.length > 0) {
        bookingsWithInterests++;
        console.log(`   Booking ${booking.bookingId} - User: ${booking.user.name} - Interests: ${booking.user.profileDetails.interests.join(', ')}`);
      }
    });
    
    console.log(`\n✅ Bookings with user interests: ${bookingsWithInterests}/${bookings.length}`);
    
    // Try the same aggregation that analytics uses
    console.log('\n🔬 Testing analytics aggregation...');
    const attendeeData = await Booking.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $project: {
          userId: '$userData._id',
          userName: '$userData.name',
          userEmail: '$userData.email',
          interests: '$userData.profileDetails.interests',
          totalAmount: '$totalAmount',
          eventName: '$eventData.name'
        }
      }
    ]);
    
    console.log(`\nAggregation results: ${attendeeData.length} records`);
    attendeeData.forEach(attendee => {
      if (attendee.interests && attendee.interests.length > 0) {
        console.log(`   ${attendee.userName}: ${attendee.interests.join(', ')}`);
      }
    });

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the check
connectDB().then(() => {
  checkInterestsData();
});
