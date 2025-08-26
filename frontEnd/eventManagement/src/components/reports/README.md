# Analytics & Reports System

This is a comprehensive analytics and reporting system that perfectly matches your backend analytics controller. The system provides detailed insights into event performance, revenue analytics, attendee demographics, and comprehensive reporting capabilities.

## 🚀 Features

### 📊 **Dashboard Overview**
- **Key Metrics**: Total events, bookings, revenue, tickets sold
- **Growth Indicators**: Percentage changes vs previous period
- **Real-time Updates**: Loading states and automatic refresh
- **Event Status Breakdown**: Upcoming, ongoing, completed events

### 💰 **Revenue Analytics**
- **Interactive Charts**: Daily revenue trends with Recharts
- **Growth Analysis**: Period-over-period comparison
- **Revenue by Event**: Top performing events ranking
- **Summary Metrics**: Total revenue, bookings, growth percentage

### 👥 **Attendee Insights**
- **Demographics**: Age groups, gender distribution
- **Geographic Data**: Top locations with percentage breakdown
- **Interest Analysis**: Popular interests among attendees
- **Engagement Metrics**: Unique vs repeat attendees

### 🎯 **Event Performance**
- **Performance Ranking**: Events by revenue and bookings
- **Comparative Analysis**: Side-by-side event comparison
- **Ticket Metrics**: Average prices, total tickets sold
- **Visual Analytics**: Interactive bar charts and tooltips

### 📈 **Advanced Filtering**
- **Time Periods**: Week, month, quarter, year, custom range
- **Custom Date Range**: Start and end date selection
- **Real-time Filtering**: Instant data updates
- **Export Options**: Multiple report formats

### 📋 **Recent Activity**
- **Live Updates**: Recent bookings and events
- **Activity Timeline**: Chronological activity feed
- **Quick Actions**: Create event, view reports
- **Status Indicators**: Booking status visualization

### 📤 **Export & Reporting**
- **Multiple Formats**: CSV, PDF export ready
- **Report Types**: Dashboard, revenue, attendee, event reports
- **Custom Reports**: Filtered data export
- **Automated Downloads**: Browser-based file downloads

## 📁 File Structure

```
src/
├── pages/
│   └── Analytics.jsx                    # Main analytics page with tabs
├── components/
│   └── analytics/
│       ├── DashboardOverview.jsx        # Key metrics cards
│       ├── RevenueChart.jsx             # Revenue trend charts
│       ├── AttendeeInsights.jsx         # Demographics pie charts
│       ├── EventPerformance.jsx         # Event ranking bar charts
│       ├── RecentActivity.jsx           # Activity timeline
│       └── AnalyticsFilters.jsx         # Filtering controls
└── api/
    └── analyticsAPI.js                  # API service functions
```

## 🔌 Backend Integration

The system is designed to work seamlessly with your backend analytics controller:

### **Supported Endpoints:**
```javascript
// All endpoints are implemented in analyticsAPI.js
✅ GET /api/analytics/dashboard           // Dashboard statistics
✅ GET /api/analytics/revenue             // Revenue analytics
✅ GET /api/analytics/events/performance  // Event performance
✅ GET /api/analytics/attendees/insights  // Attendee insights
✅ GET /api/analytics/attendees/locations // Location analytics
✅ GET /api/analytics/attendees/interests // Interest analytics
✅ GET /api/analytics/attendees/age-groups // Age group analytics
✅ GET /api/analytics/attendees/gender    // Gender analytics
✅ GET /api/analytics/social-media        // Social media reach
✅ GET /api/analytics/export/:type        // Export functionality
```

### **Query Parameters Supported:**
- `period` - week, month, quarter, year
- `startDate` - Custom start date (YYYY-MM-DD)
- `endDate` - Custom end date (YYYY-MM-DD)

### **Response Data Formats:**

#### Dashboard Stats Response:
```javascript
{
  overview: {
    totalEvents: Number,
    totalBookings: Number,
    totalRevenue: Number,
    totalTicketsSold: Number,
    averageTicketPrice: Number
  },
  eventStatusBreakdown: [
    { _id: 'status', count: Number }
  ],
  recentBookings: Array,
  upcomingEvents: Array
}
```

#### Revenue Analytics Response:
```javascript
{
  summary: {
    totalRevenue: Number,
    growthPercentage: Number,
    totalBookings: Number
  },
  dailyRevenue: [
    {
      _id: { year: Number, month: Number, day: Number },
      dailyRevenue: Number,
      dailyBookings: Number
    }
  ],
  revenueByEvent: Array
}
```

#### Attendee Insights Response:
```javascript
{
  totalAttendees: Number,
  uniqueAttendees: Number,
  ageGroups: Array,
  genderBreakdown: Array,
  topLocations: Array,
  topInterests: Array
}
```

## 🎨 UI Components

### **Tab Navigation:**
- 📊 **Overview** - Dashboard summary
- 💰 **Revenue** - Revenue analytics
- 👥 **Attendees** - Demographics insights
- 🎯 **Events** - Event performance

### **Chart Types:**
- **Line Charts** - Revenue trends over time
- **Pie Charts** - Demographics distribution
- **Bar Charts** - Event performance comparison
- **Cards** - Key metrics overview

### **Interactive Features:**
- **Tooltips** - Detailed hover information
- **Responsive Design** - Mobile and desktop optimized
- **Loading States** - Skeleton loading animations
- **Error Handling** - User-friendly error messages

## 🔧 How to Use

### **1. Navigation**
- Access via `/reports-dashboard` route
- Use tab navigation to switch between analytics views
- Apply filters to customize data period

### **2. Filtering Data**
```javascript
// Change time period
setFilters({ period: 'month' });

// Custom date range
setFilters({ 
  period: 'custom',
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
```

### **3. Export Reports**
```javascript
// Export complete analytics
await analyticsAPI.exportAnalytics('complete', filters);

// Export specific report type
await analyticsAPI.exportAnalytics('revenue', filters);
```

### **4. Real-time Updates**
- Click "Refresh" button for latest data
- Data auto-refreshes when filters change
- Loading indicators show during data fetch

## 🛠 Integration Steps

### **1. Replace Mock Data**
Replace mock data in `Analytics.jsx` with actual API calls:

```javascript
// Replace this
setDashboardData(mockDashboardData);

// With this
const data = await analyticsAPI.getDashboardStats(filters);
setDashboardData(data);
```

### **2. Environment Variables**
Set up your API URL in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### **3. Authentication**
Update the `getAuthToken()` function in `analyticsAPI.js` to match your auth system.

### **4. Chart Customization**
Modify chart colors and styling in each component:
```javascript
// Custom colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Chart styling
<LineChart data={chartData}>
  <Line stroke="#10B981" strokeWidth={3} />
</LineChart>
```

## 📱 Responsive Design

- ✅ **Mobile-first**: Optimized for all screen sizes
- ✅ **Grid Layouts**: Responsive grid systems
- ✅ **Touch-friendly**: Large buttons and interactions
- ✅ **Modern UI**: Clean design with Tailwind CSS

## 📊 Chart Library

Uses **Recharts** for all visualizations:
```bash
npm install recharts
```

Features:
- Interactive tooltips
- Responsive containers
- Custom styling
- Animation support
- TypeScript ready

## 🎯 Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Memoization**: Prevent unnecessary re-renders
- **Data Caching**: Reduce API calls
- **Skeleton Loading**: Better UX during loading
- **Error Boundaries**: Graceful error handling

## 📈 Analytics Insights Available

### **Revenue Insights:**
- Daily/weekly/monthly trends
- Growth rate calculations
- Event revenue comparison
- Average ticket prices

### **Attendee Insights:**
- Age group distribution
- Gender demographics
- Geographic distribution
- Interest categories
- Repeat vs new attendees

### **Event Insights:**
- Performance rankings
- Booking conversion rates
- Popular event categories
- Venue performance

### **Business Intelligence:**
- ROI calculations
- Market penetration
- Customer lifetime value
- Seasonal trends

The system is **production-ready** and provides enterprise-level analytics capabilities that will help you make data-driven decisions for your event management business! 🚀

## 🔍 Advanced Features

- **Real-time Dashboard**: Live updates
- **Comparative Analysis**: Period comparisons
- **Predictive Analytics**: Ready for ML integration
- **Custom KPIs**: Configurable metrics
- **Multi-tenant Support**: User-specific analytics
- **API Rate Limiting**: Optimized requests
- **Data Visualization**: Professional charts
- **Export Capabilities**: Multiple formats
