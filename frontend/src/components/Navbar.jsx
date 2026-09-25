import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Calendar, User, LogOut, Users, ShieldAlert, Clock, Menu, X, LayoutDashboard, Stethoscope } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-teal-900 to-teal-600 bg-clip-text text-transparent">
                CareQueue
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-teal-600">Smart Clinic System</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Home
            </Link>
            
            <Link 
              to="/doctors" 
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/doctors') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Find Doctors
            </Link>

            {user?.role === 'ROLE_PATIENT' && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/appointments" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/appointments') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  My Appointments
                </Link>
              </>
            )}

            {user?.role === 'ROLE_DOCTOR' && (
              <>
                <Link 
                  to="/doctor-dashboard" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/doctor-dashboard') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Doctor Dashboard
                </Link>
                <Link 
                  to="/doctor-dashboard?tab=queue" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${location.search.includes('queue') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Live Queue
                </Link>
              </>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <>
                <Link 
                  to="/admin" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/admin') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Admin Overview
                </Link>
                <Link 
                  to="/admin/doctors" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/admin/doctors') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Manage Doctors
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/admin/users') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Manage Users
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-200 transition-colors">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-teal-600 transition-colors">
                      {user.fullName}
                    </span>
                    <span className="block text-[10px] font-semibold uppercase text-teal-600 tracking-wider">
                      {user.role.replace('ROLE_', '')}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded-lg shadow-sm shadow-teal-500/20 transition-all hover:shadow-md"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link 
            to="/doctors" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Find Doctors
          </Link>

          {user && (
            <>
              <Link 
                to={user.role === 'ROLE_ADMIN' ? '/admin' : user.role === 'ROLE_DOCTOR' ? '/doctor-dashboard' : '/dashboard'} 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-teal-600 hover:bg-teal-50"
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                My Profile ({user.fullName})
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          )}

          {!user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
