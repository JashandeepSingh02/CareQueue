import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UIHelpers';
import { Toast } from '../components/Toast';
import { User, Mail, Phone, Calendar, Save, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        gender: data.gender || 'Male',
        dateOfBirth: data.dateOfBirth || ''
      });
    } catch (err) {
      setToast({ message: 'Failed to load user profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile(formData);
      setProfile(updated);
      if (user) {
        setUser({ ...user, fullName: updated.fullName });
      }
      setToast({ message: 'Profile details updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold text-2xl flex items-center justify-center">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{profile?.fullName}</h1>
            <p className="text-xs text-slate-500">{profile?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
              {profile?.role?.replace('ROLE_', '')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

    </div>
  );
};
