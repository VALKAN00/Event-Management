const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/eventx_studio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedBookings = async () => {
  try {
    console.log(' Starting booking seeding...');

    // Get all users and events
    const users = await User.find({ isActive: true });
    const events = await Event.find({ isActive: true });

    if (users.length === 0 || events.length === 0) {
      console.log(' No users or events found. Please seed users and events first.');
      return;
    }

    console.log(` Found ${users.length} users and ${events.length} events`);

    // Clear existing bookings (optional)
    await Booking.deleteMany({});
    console.log('🧹 Cleared existing bookings');

    const bookings = [];

    // Create sample bookings
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      // Create 1-2 bookings per user
      const bookingCount = Math.floor(Math.random() * 2) + 1;
      
      for (let j = 0; j < bookingCount; j++) {
        const selectedEvent = events[Math.floor(Math.random() * events.length)];
        
        // Get available seats
        const availableSeats = selectedEvent.seatConfiguration.seatMap.filter(
          seat => seat.status === 'available'
        );
        
        if (availableSeats.length > 0) {
          const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
          const seatPrice = randomSeat.price || 2500; // Default price if not set
          
          const booking = {
            bookingId: `BK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            user: user._id,
            event: selectedEvent._id,
            seats: [{
              seatNumber: randomSeat.seatNumber,
              row: randomSeat.row || 'A',
              section: randomSeat.section || 'General',
              price: seatPrice
            }],
            attendeeInfo: {
              name: user.name,
              email: user.email,
              phone: user.profileDetails.phone || '+94771234567'
            },
            totalAmount: seatPrice,
            paymentMethod: 'credit_card',
            status: 'confirmed',
            bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            paymentDetails: {
              transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
              paymentStatus: 'completed',
              paymentDate: new Date()
            }
          };
          
          bookings.push(booking);
          
          // Mark seat as booked in event
          await Event.findByIdAndUpdate(
            selectedEvent._id,
            {
              $set: {
                [`seatConfiguration.seatMap.${selectedEvent.seatConfiguration.seatMap.findIndex(s => s.seatNumber === randomSeat.seatNumber)}.status`]: 'booked'
              }
            }
          );
        }
      }
    }

    // Insert all bookings
    const createdBookings = await Booking.insertMany(bookings);
    console.log(` Created ${createdBookings.length} sample bookings`);

    // Update event analytics
    for (const event of events) {
      const eventBookings = await Booking.countDocuments({ 
        event: event._id, 
        status: { $in: ['confirmed', 'checked-in'] }
      });
      
      const revenue = await Booking.aggregate([
        {
          $match: { 
            event: event._id, 
            status: { $in: ['confirmed', 'checked-in'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);

      await Event.findByIdAndUpdate(event._id, {
        $set: {
          'analytics.totalBookings': eventBookings,
          'analytics.revenue': revenue[0]?.total || 0
        }
      });
    }

    console.log(' Booking seeding completed!');
    console.log(` Analytics data populated for ${events.length} events`);
    
  } catch (error) {
    console.error(' Error seeding bookings:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedBookings();
