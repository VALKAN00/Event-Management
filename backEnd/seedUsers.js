const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/eventx_studio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    // Clear existing users (optional - commented out for safety)
    // await User.deleteMany({});

    const users = [
      {
        name: 'Admin User',
        email: 'admin@eventx.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true,
        profileDetails: {
          bio: 'System administrator with full access to all features.'
        }
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'User123!',
        role: 'user',
        isActive: true,
        profileDetails: {
          bio: 'Event organizer and marketing specialist.'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'User123!',
        role: 'user',
        isActive: false,
        profileDetails: {
          bio: 'Former event coordinator.'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true,
        profileDetails: {
          bio: 'Technical administrator and system maintainer.'
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: 'User123!',
        role: 'user',
        isActive: true,
        profileDetails: {
          bio: 'Event attendee and community member.'
        }
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.name} (${userData.email})`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log('\n🎉 User seeding completed!');
    console.log('\nYou can now log in with:');
    console.log('📧 admin@eventx.com / Admin123! (Admin)');
    console.log('📧 john.doe@example.com / User123! (User)');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedUsers();
