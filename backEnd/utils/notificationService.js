const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { createNotification } = require('../controllers/notifications');

// Check for upcoming events and send notifications
const checkUpcomingEvents = async () => {
  try {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find events happening in the next 24 hours
    const upcomingEvents24h = await Event.find({
      date: {
        $gte: now,
        $lte: twentyFourHoursFromNow
      },
      status: 'active',
      isActive: true,
      notificationSent24h: { $ne: true }
    }).populate('organizer', 'name email');

    // Find events happening in the next week
    const upcomingEventsWeek = await Event.find({
      date: {
        $gte: now,
        $lte: oneWeekFromNow
      },
      status: 'active',
      isActive: true,
      notificationSentWeek: { $ne: true }
    }).populate('organizer', 'name email');

    // Send 24-hour notifications
    for (const event of upcomingEvents24h) {
      // Notify event organizer
      await createNotification(
        event.organizer._id,
        '⏰ Event Starting Tomorrow',
        `Your event "${event.name}" is starting tomorrow at ${new Date(event.date).toLocaleString()}. Make sure everything is ready!`,
        'event_upcoming',
        event._id,
        'Event',
        'high'
      );

      // Notify all attendees with bookings
      const bookings = await Booking.find({ 
        event: event._id, 
        status: { $in: ['confirmed', 'checked-in'] }
      }).populate('user', 'name email');

      for (const booking of bookings) {
        await createNotification(
          booking.user._id,
          '🎪 Event Tomorrow',
          `Don't forget! "${event.name}" is tomorrow at ${new Date(event.date).toLocaleString()}. See you there!`,
          'event_upcoming',
          event._id,
          'Event',
          'high'
        );
      }

      // Mark as notified
      await Event.findByIdAndUpdate(event._id, { notificationSent24h: true });
    }

    // Send 1-week notifications
    for (const event of upcomingEventsWeek) {
      // Notify event organizer
      await createNotification(
        event.organizer._id,
        '📅 Event Next Week',
        `Your event "${event.name}" is scheduled for ${new Date(event.date).toLocaleDateString()}. Time to finalize preparations!`,
        'event_upcoming',
        event._id,
        'Event',
        'medium'
      );

      // Notify all attendees with bookings
      const bookings = await Booking.find({ 
        event: event._id, 
        status: { $in: ['confirmed', 'checked-in'] }
      }).populate('user', 'name email');

      for (const booking of bookings) {
        await createNotification(
          booking.user._id,
          '📍 Upcoming Event',
          `Get ready! "${event.name}" is coming up on ${new Date(event.date).toLocaleDateString()}. Mark your calendar!`,
          'event_upcoming',
          event._id,
          'Event',
          'medium'
        );
      }

      // Mark as notified
      await Event.findByIdAndUpdate(event._id, { notificationSentWeek: true });
    }

    console.log(`✅ Checked upcoming events: ${upcomingEvents24h.length} (24h), ${upcomingEventsWeek.length} (1week)`);
    
  } catch (error) {
    console.error('Error checking upcoming events:', error);
  }
};

// Set up interval to check every hour
const startUpcomingEventsChecker = () => {
  // Run immediately
  checkUpcomingEvents();
  
  // Then run every hour
  setInterval(checkUpcomingEvents, 60 * 60 * 1000);
  
  console.log('🔔 Upcoming events notification checker started');
};

module.exports = {
  checkUpcomingEvents,
  startUpcomingEventsChecker
};
