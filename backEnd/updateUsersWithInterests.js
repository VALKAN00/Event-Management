const mongoose = require('mongoose');
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

const updateUsersWithInterests = async () => {
  try {
    console.log('🔄 Updating users with interests data...');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found');
      return;
    }

    const interestOptions = [
      'Live Music', 'EDM Music', 'Innovation', 'Food Festivals', 
      'Sports', 'Art', 'Technology'
    ];
    
    let updated = 0;

    // Update each user with random interests
    for (const user of users) {
      // Skip if user already has interests
      if (user.profileDetails?.interests && user.profileDetails.interests.length > 0) {
        console.log(`User ${user.name} already has interests: ${user.profileDetails.interests.join(', ')}`);
        continue;
      }

      // Generate 2-3 random interests for each user
      const numInterests = Math.floor(Math.random() * 2) + 2; // 2-3 interests
      const shuffled = [...interestOptions].sort(() => 0.5 - Math.random());
      const selectedInterests = shuffled.slice(0, numInterests);
      
      // Initialize profileDetails if it doesn't exist
      if (!user.profileDetails) {
        user.profileDetails = {};
      }
      
      // Update user with interests
      user.profileDetails.interests = selectedInterests;
      
      await user.save();
      updated++;
      
      console.log(`Updated user ${user.name} with interests: ${selectedInterests.join(', ')}`);
    }

    console.log(`✅ Updated ${updated} users with interests data`);
    
    // Show interests distribution
    const allUsers = await User.find({});
    const interestCounts = {};
    
    allUsers.forEach(user => {
      if (user.profileDetails?.interests) {
        user.profileDetails.interests.forEach(interest => {
          interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        });
      }
    });

    console.log('📊 Interests Distribution:');
    Object.entries(interestCounts).forEach(([interest, count]) => {
      console.log(`   ${interest}: ${count} users`);
    });

  } catch (error) {
    console.error('❌ Error updating users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the update
connectDB().then(() => {
  updateUsersWithInterests();
});
