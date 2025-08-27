import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./global/Header";
import Sidebar from "./global/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManageEvents from "./pages/ManageEvents";
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/event-details" element={<EventDetails />} />
            <Route path="/booking-tickets" element={<Booking />} />
            <Route path="/attendee-insights" element={<AttendeeInsights />} />
            <Route path="/Single_Attendee_Insights" element={<SingleAttendeeInsights />} />
            <Route path="/reports-dashboard" element={<Analytics />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/event-categories" element={<EventCategories />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
