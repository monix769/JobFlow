import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children, requiredRole }) {
  const currentUser = authService.getCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // If wrong role, redirect to appropriate home or user dashboard
    if (currentUser.role === 'RECRUITER') {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else {
      return <Navigate to="/candidate-dashboard" replace />;
    }
  }

  return children;
}
