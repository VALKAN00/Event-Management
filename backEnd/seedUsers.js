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
          bio: 'System administrator with full access to all features.',
          phone: '+94771234567',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'other',
          location: {
            city: 'Colombo',
            country: 'Sri Lanka'
          },
          interests: ['Technology', 'Innovation', 'Art']
        }
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'User123!',
        role: 'user',
        isActive: true,
        profileDetails: {
          bio: 'Event organizer and marketing specialist.',
          phone: '+94771234568',
          dateOfBirth: new Date('1990-07-22'),
          gender: 'male',
          location: {
            city: 'Kandy',
            country: 'Sri Lanka'
          },
          interests: ['Live Music', 'Innovation', 'Sports']
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'User123!',
        role: 'user',
        isActive: false,
        profileDetails: {
          bio: 'Former event coordinator.',
          phone: '+94771234569',
          dateOfBirth: new Date('1988-12-05'),
          gender: 'female',
          location: {
            city: 'Galle',
            country: 'Sri Lanka'
          },
          interests: ['Food Festivals', 'Art', 'Innovation']
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true,
        profileDetails: {
          bio: 'Technical administrator and system maintainer.',
          phone: '+94771234570',
          dateOfBirth: new Date('1982-09-18'),
          gender: 'male',
          location: {
            city: 'Colombo',
            country: 'Sri Lanka'
          },
          interests: ['Technology', 'Innovation', 'EDM Music']
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: 'User123!',
        role: 'user',
        isActive: true,
        profileDetails: {
          bio: 'Event attendee and community member.',
          phone: '+94771234571',
          dateOfBirth: new Date('1995-04-30'),
          gender: 'female',
          location: {
            city: 'Jaffna',
            country: 'Sri Lanka'
          },
          interests: ['Live Music', 'Food Festivals', 'Sports']
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
        // Update existing user's profile details
        await User.findByIdAndUpdate(
          existingUser._id,
          { 
            $set: { 
              profileDetails: userData.profileDetails 
            } 
          },
          { new: true }
        );
        console.log(`🔄 Updated profile for existing user: ${userData.email}`);
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
