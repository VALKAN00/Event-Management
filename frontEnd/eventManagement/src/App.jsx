import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./global/Header";
import Sidebar from "./global/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManageEvents from "./pages/ManageEvents";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./components/ManageEvents/EventDetails";
import Booking from "./pages/Booking";
import AttendeeInsights from "./pages/AttendeeInsights";
import SingleAttendeeInsights from "./pages/SingleAttendeeInsights";
import Analytics from "./pages/Analytics";
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
  
  // Check if current route is Dashboard (/ or /dashboard)
  const isDashboardPage = location.pathname === "/" || location.pathname === "/dashboard";
  
  // Check if current route is an auth page
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

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
    <div className="App flex justify-between" style={{ width: "100%" }}>
      <Sidebar />
      <div
        className="m-3 bg-[#F2F2F2] rounded-2xl overflow-hidden"
        style={{ width: "100%" }}
      >
        {/* Conditionally render Header only on Dashboard page */}
        {isDashboardPage && (
          <div className="m-3">
            <Header />
          </div>
        )}
        <div className="Pages">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Main Application Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
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
            <Route path="/booking-tickets" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/attendee-insights" element={
              <ProtectedRoute>
                <AttendeeInsights />
              </ProtectedRoute>
            } />
            <Route path="/Single_Attendee_Insights" element={
              <ProtectedRoute>
                <SingleAttendeeInsights />
              </ProtectedRoute>
            } />
            <Route path="/reports-dashboard" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <Marketing />
              </ProtectedRoute>
            } />
            <Route path="/event-categories" element={
              <ProtectedRoute>
                <EventCategories />
              </ProtectedRoute>
            } />
            <Route path="/manage-users" element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
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
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
