import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to dispatch password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Reset Your Password</h2>
          <p className="text-sm text-slate-500">Enter your registered email address to receive a secure reset link</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Check Your Inbox / Server Logs</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              If an account with <strong className="font-bold">{email}</strong> exists, a secure tokenized reset link has been dispatched.
            </p>
            <div className="pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@carequeue.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
