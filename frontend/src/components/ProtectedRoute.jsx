import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role to appropriate default dashboard
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_DOCTOR') return <Navigate to="/doctor-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
