import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      // Redirect based on role
      if (res.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (res.role === 'ROLE_DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to CareQueue</h2>
          <p className="text-sm text-slate-500">Access your clinic portal & queue status</p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
            ⚡ Quick Demo 1-Click Fill
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('patient@carequeue.com', 'Patient@123')}
              className="px-2 py-1.5 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 transition-all"
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('neuro.chen@carequeue.com', 'Doctor@123')}
              className="px-2 py-1.5 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 transition-all"
            >
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('admin@carequeue.com', 'Admin@123')}
              className="px-2 py-1.5 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. patient@carequeue.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Don't have a patient account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
