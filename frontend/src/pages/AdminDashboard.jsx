import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { doctorService } from '../services/doctorService';
import { LoadingSpinner, StatusBadge } from '../components/UIHelpers';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { Users, Stethoscope, Calendar, ShieldCheck, Plus, Trash2, Edit, CheckCircle, XCircle, Activity } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'doctors', 'users', 'appointments'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Add Doctor Modal State
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    fullName: '',
    email: '',
    password: 'Doctor@123',
    phone: '',
    specialization: 'Cardiology',
    qualification: 'MD',
    experience: 5,
    consultationFee: 100,
    bio: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getStatistics();
      setStats(statsRes);

      const docsRes = await adminService.getAllDoctors();
      setDoctors(docsRes || []);

      const usersRes = await adminService.getAllUsers();
      setUsers(usersRes || []);

      const appsRes = await adminService.getAllAppointments();
      setAppointments(appsRes || []);
    } catch (err) {
      setToast({ message: 'Failed to load administrative data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await doctorService.createDoctor(newDocData);
      setToast({ message: `Doctor ${newDocData.fullName} created successfully!`, type: 'success' });
      setIsAddDocOpen(false);
      fetchAdminData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to create doctor', type: 'error' });
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${name}?`)) return;
    try {
      await doctorService.deleteDoctor(id);
      setToast({ message: `Doctor ${name} removed.`, type: 'success' });
      fetchAdminData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete doctor', type: 'error' });
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      await adminService.deleteUser(id);
      setToast({ message: `User ${email} deleted.`, type: 'success' });
      fetchAdminData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete user', type: 'error' });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin system overview..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">ADMIN CONTROL CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold">System Administration Dashboard</h1>
          <p className="text-xs text-slate-300">Oversee clinic metrics, staff accounts, patients, and global appointment queues.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'doctors' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Manage Doctors
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appointments' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            All Appointments
          </button>
        </div>
      </div>

      {/* TAB 1: System Metrics Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
              <div className="text-3xl font-black text-slate-900">{stats?.totalPatients || 0}</div>
              <p className="text-xs text-slate-500">Registered platform patients</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Doctors</span>
              <div className="text-3xl font-black text-teal-600">{stats?.activeDoctors || 0} / {stats?.totalDoctors || 0}</div>
              <p className="text-xs text-slate-500">Licensed clinic specialists</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</span>
              <div className="text-3xl font-black text-blue-600">{stats?.todayAppointments || 0}</div>
              <p className="text-xs text-slate-500">Appointments scheduled today</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total System Appointments</span>
              <div className="text-3xl font-black text-purple-600">{stats?.totalAppointments || 0}</div>
              <p className="text-xs text-slate-500">Lifetime clinic bookings</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Doctors */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Medical Staff Directory</h3>
              <p className="text-xs text-slate-500">Add, view, and manage doctor credentials and specializations</p>
            </div>
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Doctor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{doc.fullName}</span>
                      <span className="text-[10px] text-slate-400">{doc.email}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{doc.specialization}</td>
                    <td className="px-4 py-3.5 font-bold text-teal-700">{formatCurrency(doc.consultationFee)}</td>
                    <td className="px-4 py-3.5">{doc.experience} Yrs</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {doc.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteDoctor(doc.id, doc.fullName)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manage Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">User Accounts Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{u.fullName}</td>
                    <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-right">
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      <Modal isOpen={isAddDocOpen} onClose={() => setIsAddDocOpen(false)} title="Register New Doctor">
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              value={newDocData.fullName}
              onChange={(e) => setNewDocData({ ...newDocData, fullName: e.target.value })}
              placeholder="e.g. Dr. Alex Vance"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email *</label>
              <input
                type="email"
                required
                value={newDocData.email}
                onChange={(e) => setNewDocData({ ...newDocData, email: e.target.value })}
                placeholder="alex@carequeue.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization *</label>
              <input
                type="text"
                required
                value={newDocData.specialization}
                onChange={(e) => setNewDocData({ ...newDocData, specialization: e.target.value })}
                placeholder="e.g. Cardiology"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee ($) *</label>
              <input
                type="number"
                required
                value={newDocData.consultationFee}
                onChange={(e) => setNewDocData({ ...newDocData, consultationFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience (Yrs)</label>
              <input
                type="number"
                value={newDocData.experience}
                onChange={(e) => setNewDocData({ ...newDocData, experience: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
          >
            Create Doctor Profile
          </button>
        </form>
      </Modal>

    </div>
  );
};
