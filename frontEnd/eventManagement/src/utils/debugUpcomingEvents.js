// Debug utility for upcoming events
export const debugUpcomingEvents = async () => {
  try {
    console.log('🔍 Starting upcoming events debug...');
    
    // Test direct API call
    const apiUrl = import.meta.env.VITE_API_URL || 'https://eventx-studio-backend.onrender.com/api';
    const response = await fetch(`${apiUrl}/events/upcoming?limit=5`);
    const data = await response.json();
    
    console.log('📊 Raw API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });
    
    if (data.success) {
      console.log('✅ API is working correctly');
      console.log('📅 Events found:', data.data?.events?.length || 0);
      
      if (data.data?.events?.length > 0) {
        console.log('🎯 Sample event:', data.data.events[0]);
      }
    } else {
      console.log('❌ API returned error:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('💥 Debug error:', error);
    return null;
  }
};

// Test upcoming events formatting
export const testEventFormatting = (events) => {
  console.log('🎨 Testing event formatting...');
  
  events.forEach((event, index) => {
    console.log(`Event ${index + 1}:`, {
      id: event._id,
      title: event.title || event.name,
      date: event.date,
      formatted: new Date(event.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      })
    });
  });
};

export default { debugUpcomingEvents, testEventFormatting };
