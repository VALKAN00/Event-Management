import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAuthenticated } from '../../api/authAPI';
import Dashboard from '../../pages/Dashboard';

const DefaultRoute = () => {
  const { user } = useAuth();
  
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is admin, show Dashboard
  if (user && user.role === 'admin') {
    return <Dashboard />;
  }
  
  // If user is regular user, redirect to Events page
  return <Navigate to="/manage-events" replace />;
};

export default DefaultRoute;
