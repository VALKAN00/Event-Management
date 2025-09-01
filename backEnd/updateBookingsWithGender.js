const mongoose = require('mongoose');
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

const updateExistingBookings = async () => {
  try {
    console.log('🔄 Updating existing bookings with gender data...');
    
    // Get all bookings
    const bookings = await Booking.find({});
    console.log(`Found ${bookings.length} existing bookings`);
    
    if (bookings.length === 0) {
      console.log('No existing bookings found');
      return;
    }

    const genders = ['Male', 'Female'];
    let updated = 0;

    // Update each booking with random gender data
    for (const booking of bookings) {
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      
      // Update attendeeInfo with gender
      booking.attendeeInfo = {
        ...booking.attendeeInfo,
        gender: randomGender
      };
      
      await booking.save();
      updated++;
      
      console.log(`Updated booking ${booking.bookingId} with gender: ${randomGender}`);
    }

    console.log(`✅ Updated ${updated} bookings with gender data`);
    
    // Show gender distribution
    const genderCounts = await Booking.aggregate([
      {
        $group: {
          _id: '$attendeeInfo.gender',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('📊 Gender Distribution:');
    genderCounts.forEach(item => {
      console.log(`   ${item._id || 'Not specified'}: ${item.count} bookings`);
    });

  } catch (error) {
    console.error('❌ Error updating bookings:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the update
connectDB().then(() => {
  updateExistingBookings();
});
