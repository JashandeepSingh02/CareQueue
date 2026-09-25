import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { DoctorsPage } from '../pages/DoctorsPage';
import { DoctorDetailsPage } from '../pages/DoctorDetailsPage';
import { QueuePage } from '../pages/QueuePage';
import { PatientDashboard } from '../pages/PatientDashboard';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        <Route path="/appointments/doctor/:doctorId/queue" element={<QueuePage />} />

        {/* Patient Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common Authenticated Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
};
