const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');

// Simple seed script to create admin user and sample events
const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventx_studio');
    console.log('Connected to MongoDB');

    // Check if admin user exists, if not create one
    let adminUser = await User.findOne({ email: 'admin@eventx.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'Event Admin',
        email: 'admin@eventx.com',
        password: hashedPassword,
        role: 'admin',
        profileDetails: {
          phone: '+94777123456',
          dateOfBirth: new Date('1985-01-15'),
          gender: 'male',
          location: { city: 'Colombo', country: 'Sri Lanka' },
          interests: ['Technology', 'Live Music']
        }
      });
      console.log('Admin user created');
    }

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Create sample events with correct structure
    const sampleEvents = [
      {
        name: 'Tech Conference 2025',
        description: 'Annual technology conference featuring latest innovations in AI, blockchain, and software development.',
        venue: {
          name: 'Colombo Convention Centre',
          address: '1 Lotus Road, Colombo 01',
          city: 'Colombo',
          country: 'Sri Lanka',
          capacity: 500
        },
        date: new Date('2025-12-15'),
        time: {
          start: '09:00',
          end: '17:00'
        },
        pricing: {
          ticketPrice: 5000,
          currency: 'LKR'
        },
        categories: ['Technology'],
        tags: ['conference', 'tech', 'innovation'],
        organizer: adminUser._id,
        status: 'upcoming',
        isActive: true,
        seatConfiguration: {
          totalSeats: 500,
          availableSeats: 500,
          bookedSeats: 0,
          reservedSeats: 0,
          seatMap: []
        }
      },
      {
        name: 'Music Festival 2025',
        description: 'Multi-genre music festival featuring local and international artists.',
        venue: {
          name: 'Galle Face Green',
          address: 'Galle Face Green, Colombo 03',
          city: 'Colombo',
          country: 'Sri Lanka',
          capacity: 1000
        },
        date: new Date('2025-12-20'),
        time: {
          start: '15:00',
          end: '23:00'
        },
        pricing: {
          ticketPrice: 3000,
          currency: 'LKR'
        },
        categories: ['Live Music'],
        tags: ['music', 'festival', 'live'],
        organizer: adminUser._id,
        status: 'upcoming',
        isActive: true,
        seatConfiguration: {
          totalSeats: 1000,
          availableSeats: 1000,
          bookedSeats: 0,
          reservedSeats: 0,
          seatMap: []
        }
      },
      {
        name: 'Art Exhibition 2025',
        description: 'Contemporary art exhibition showcasing local and international talent.',
        venue: {
          name: 'National Art Gallery',
          address: 'Ananda Coomaraswamy Mawatha, Colombo 07',
          city: 'Colombo',
          country: 'Sri Lanka',
          capacity: 200
        },
        date: new Date('2025-11-10'),
        time: {
          start: '10:00',
          end: '18:00'
        },
        pricing: {
          ticketPrice: 1500,
          currency: 'LKR'
        },
        categories: ['Art'],
        tags: ['art', 'exhibition', 'culture'],
        organizer: adminUser._id,
        status: 'upcoming',
        isActive: true,
        seatConfiguration: {
          totalSeats: 200,
          availableSeats: 200,
          bookedSeats: 0,
          reservedSeats: 0,
          seatMap: []
        }
      }
    ];

    // Generate seat maps for each event
    for (const event of sampleEvents) {
      const seatMap = [];
      for (let i = 1; i <= event.seatConfiguration.totalSeats; i++) {
        // Create seat numbers like A001, A002, etc.
        const row = String.fromCharCode(65 + Math.floor((i - 1) / 50)); // A, B, C, etc.
        const seatInRow = ((i - 1) % 50) + 1;
        seatMap.push({
          seatNumber: `${row}${seatInRow.toString().padStart(3, '0')}`,
          row: row,
          section: 'General',
          status: 'available'
        });
      }
      event.seatConfiguration.seatMap = seatMap;
    }

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`${createdEvents.length} events created with seat maps`);

    // Display created events
    console.log('\nCreated events:');
    for (const event of createdEvents) {
      console.log(`- ${event.name} (${event._id})`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Price: ${event.pricing.currency} ${event.pricing.ticketPrice}`);
      console.log(`  Seats: ${event.seatConfiguration.totalSeats}`);
      console.log(`  Sample seats: ${event.seatConfiguration.seatMap.slice(0, 5).map(s => s.seatNumber).join(', ')}...`);
    }

    console.log('\\n Sample events created successfully!');
    console.log('Admin login: admin@eventx.com / admin123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
