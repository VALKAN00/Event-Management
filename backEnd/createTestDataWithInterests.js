const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
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

const createTestDataWithInterests = async () => {
  try {
    console.log('🚀 Creating test data with interests...');
    
    // First, ensure we have users with interests
    const interestOptions = ['Live Music', 'EDM Music', 'Innovation', 'Food Festivals', 'Sports', 'Art', 'Technology'];
    
    // Update existing users with interests
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      // Skip if user already has interests
      if (user.profileDetails?.interests && user.profileDetails.interests.length > 0) {
        console.log(`User ${user.name} already has interests: ${user.profileDetails.interests.join(', ')}`);
        continue;
      }
      
      // Add random interests
      const numInterests = Math.floor(Math.random() * 3) + 2; // 2-4 interests
      const shuffled = [...interestOptions].sort(() => 0.5 - Math.random());
      const selectedInterests = shuffled.slice(0, numInterests);
      
      if (!user.profileDetails) {
        user.profileDetails = {};
      }
      
      user.profileDetails.interests = selectedInterests;
      await user.save();
      
      console.log(`✅ Updated user ${user.name} with interests: ${selectedInterests.join(', ')}`);
    }
    
    // Now let's check what analytics would return
    console.log('\n🔍 Testing analytics aggregation...');
    
    const testAggregation = await Booking.aggregate([
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
          eventName: '$eventData.name',
          status: '$status'
        }
      }
    ]);
    
    console.log(`\nAggregation returned ${testAggregation.length} results`);
    
    // Calculate interests distribution
    const interestAnalysis = {};
    testAggregation.forEach(attendee => {
      if (attendee.interests && attendee.interests.length > 0) {
        console.log(`${attendee.userName}: ${attendee.interests.join(', ')}`);
        attendee.interests.forEach(interest => {
          interestAnalysis[interest] = (interestAnalysis[interest] || 0) + 1;
        });
      } else {
        console.log(`${attendee.userName}: No interests`);
      }
    });
    
    console.log('\n📊 Interest Analysis Result:');
    console.log(JSON.stringify(interestAnalysis, null, 2));

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
connectDB().then(() => {
  createTestDataWithInterests();
});
