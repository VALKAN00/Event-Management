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

const addInterestsToUsers = async () => {
  try {
    console.log('🎯 Adding interests to users...');
    
    const interestOptions = ['Live Music', 'EDM Music', 'Innovation', 'Food Festivals', 'Sports', 'Art', 'Technology'];
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    let updated = 0;
    
    for (const user of users) {
      // Generate random interests (2-3 per user)
      const numInterests = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...interestOptions].sort(() => 0.5 - Math.random());
      const selectedInterests = shuffled.slice(0, numInterests);
      
      // Update user
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'profileDetails.interests': selectedInterests
        }
      });
      
      updated++;
      console.log(`✅ ${user.name}: ${selectedInterests.join(', ')}`);
    }

    console.log(`\n🎉 Updated ${updated} users with interests!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

connectDB().then(() => {
  addInterestsToUsers();
});
