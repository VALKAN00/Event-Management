import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import DefaultRoute from "./components/auth/DefaultRoute";
import { isAuthenticated } from "./api/authAPI";
import Header from "./global/Header";
import Sidebar from "./global/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManageEvents from "./pages/ManageEvents";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./components/ManageEvents/EventDetails";
import SearchEventDetails from "./pages/SearchEventDetails";
import SearchSeeAll from "./pages/SearchSeeAll";
import Booking from "./pages/Booking";
import TicketPage from "./pages/TicketPage";
import AttendeeInsights from "./pages/AttendeeInsights";
import SingleAttendeeInsights from "./pages/SingleAttendeeInsights";
import Analytics from "./pages/Analytics";
import AllActivities from "./pages/AllActivities";
import ContactSupport from "./pages/ContactSupport";
import NotificationsPage from "./pages/NotificationsPage";
import Settings from "./pages/Settings";
import Marketing from "./pages/Marketing";
import EventCategories from "./pages/EventCategories";
import ManageUsers from "./pages/ManageUsers";
import AllUpcomingEvents from "./pages/AllUpcomingEvents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current route is Dashboard (/ or /dashboard)
  const isDashboardPage = location.pathname === "/" || location.pathname === "/dashboard";
  
  // Check if current route is an auth page
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // If user is not authenticated and not on auth page, redirect to login
  if (!isAuthenticated() && !isAuthPage) {
    return (
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // If it's an auth page, render without sidebar and header
  if (isAuthPage) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App lg:flex" style={{ width: "100%" }}>
      <Sidebar key={user?.id || user?.email || 'no-user'} />
      <div
        className="lg:m-3 bg-[#F2F2F2] lg:rounded-2xl overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: "100%" }}
      >
        {/* Conditionally render Header only on Dashboard page */}
        {isDashboardPage && (
          <div className="lg:m-3 m-3 mt-16 lg:mt-3">
            <Header />
          </div>
        )}
        <div className={`Pages ${!isDashboardPage ? 'pt-16 lg:pt-0' : ''}`}>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Main Application Routes */}
            <Route path="/" element={<DefaultRoute />} />
            <Route path="/dashboard" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/manage-events" element={
              <ProtectedRoute>
                <ManageEvents />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/event-details/:id?" element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } />
            <Route path="/search-event-details/:id" element={
              <ProtectedRoute>
                <SearchEventDetails />
              </ProtectedRoute>
            } />
            <Route path="/search-see-all" element={
              <ProtectedRoute>
                <SearchSeeAll />
              </ProtectedRoute>
            } />
            <Route path="/booking-tickets" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
            <Route path="/attendee-insights" element={
              <AdminRoute>
                <AttendeeInsights />
              </AdminRoute>
            } />
            <Route path="/Single_Attendee_Insights" element={
              <AdminRoute>
                <SingleAttendeeInsights />
              </AdminRoute>
            } />
            <Route path="/reports-dashboard" element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            } />
            <Route path="/all-activities" element={
              <AdminRoute>
                <AllActivities />
              </AdminRoute>
            } />
            <Route path="/contact-support" element={
              <ProtectedRoute>
                <ContactSupport />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/marketing" element={
              <AdminRoute>
                <Marketing />
              </AdminRoute>
            } />
            <Route path="/event-categories" element={
              <AdminRoute>
                <EventCategories />
              </AdminRoute>
            } />
            <Route path="/manage-users" element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            } />
            <Route path="/upcoming-events" element={
              <ProtectedRoute>
                <AllUpcomingEvents />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
