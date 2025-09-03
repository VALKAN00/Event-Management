import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAuthenticated } from '../../api/authAPI';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Then check if user is admin
  if (!user || user.role !== 'admin') {
    // Redirect non-admin users to Events page (safe page for regular users)
    return <Navigate to="/manage-events" replace />;
  }
  
  return children;
};

export default AdminRoute;
