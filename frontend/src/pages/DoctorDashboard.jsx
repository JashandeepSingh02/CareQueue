import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, StatusBadge, QueueBadge } from '../components/UIHelpers';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { Stethoscope, CheckCircle, XCircle, Clock, Play, Save, Calendar, UserCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queueData, setQueueData] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'appointments', 'availability'

  const [availabilityList, setAvailabilityList] = useState([]);
  const [savingAvail, setSavingAvail] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const docProfile = await doctorService.getMyDoctorProfile();
      setDoctor(docProfile);
      setAvailabilityList(docProfile.availability || []);

      const apps = await appointmentService.getDoctorAppointments();
      setAppointments(apps || []);

      const queue = await appointmentService.getDoctorQueue(docProfile.id);
      setQueueData(queue);
    } catch (err) {
      setToast({ message: 'Failed to load doctor dashboard data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus, notes = '') => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus, notes);
      setToast({ message: `Appointment status updated to ${newStatus}`, type: 'success' });
      fetchDoctorData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  };

  const handleSaveAvailability = async () => {
    if (!doctor) return;
    setSavingAvail(true);
    try {
      await doctorService.updateAvailability(doctor.id, availabilityList);
      setToast({ message: 'Weekly availability schedule updated successfully!', type: 'success' });
      fetchDoctorData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update schedule', type: 'error' });
    } finally {
      setSavingAvail(false);
    }
  };

  const handleAvailChange = (index, field, value) => {
    const updated = [...availabilityList];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilityList(updated);
  };

  if (loading) {
    return <LoadingSpinner text="Loading doctor console & patient queues..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={doctor?.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80'}
            alt={doctor?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold">{doctor?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                {doctor?.specialization}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{doctor?.qualification} • {doctor?.experience} Yrs Exp</p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Today's Queue
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appointments' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'availability' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            My Schedule
          </button>
        </div>
      </div>

      {/* TAB 1: Today's Queue Board */}
      {activeTab === 'queue' && (
        <div className="space-y-8">
          
          {/* Active Queue Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Current Patient */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 rounded-3xl border border-teal-700/50 shadow-lg space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">CURRENT IN ROOM</span>
              <div className="text-3xl font-black text-teal-300">
                {queueData?.currentQueueNumber ? `Queue #${queueData.currentQueueNumber}` : 'None'}
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-1">{queueData?.currentPatientName || 'No patient currently inside'}</p>
            </div>

            {/* Next Patient */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">NEXT IN LINE</span>
              <div className="text-3xl font-black text-slate-800">
                {queueData?.nextQueueNumber ? `Queue #${queueData.nextQueueNumber}` : 'None'}
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">{queueData?.nextPatientName || 'No next patient'}</p>
            </div>

            {/* Total Waiting */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">TOTAL WAITING</span>
              <div className="text-3xl font-black text-amber-600">{queueData?.totalWaiting || 0}</div>
              <p className="text-xs text-slate-500 font-medium">Patients in waiting room</p>
            </div>

            {/* Total Completed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">COMPLETED TODAY</span>
              <div className="text-3xl font-black text-emerald-600">{queueData?.totalCompleted || 0}</div>
              <p className="text-xs text-slate-500 font-medium">Consultations finished</p>
            </div>

          </div>

          {/* Today's Queue List Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Today's Patient Queue ({queueData?.appointments?.length || 0})</h3>
              <span className="text-xs text-slate-500 font-semibold">{new Date().toLocaleDateString()}</span>
            </div>

            {(!queueData?.appointments || queueData.appointments.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400">No appointments scheduled for today.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Queue #</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Queue Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {queueData.appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 font-black text-teal-700 text-sm">
                          #{app.queueNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-900 block">{app.patientName}</span>
                          <span className="text-[10px] text-slate-400">{app.patientPhone || app.patientEmail}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{app.appointmentTime}</td>
                        <td className="px-4 py-3.5 max-w-xs truncate text-slate-500">{app.reason || 'General Checkup'}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1.5">
                          {app.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 text-[11px]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 text-[11px]"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {app.status === 'ACCEPTED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                              className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-lg text-[11px] shadow-sm"
                            >
                              Mark Completed
                            </button>
                          )}

                          {app.status === 'COMPLETED' && (
                            <span className="text-emerald-600 font-bold text-[11px]">✓ Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: All Appointments Table */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">All Appointments & Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Queue #</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-3 font-bold text-teal-600">#{app.queueNumber}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{app.patientName}</td>
                    <td className="px-4 py-3">{formatDate(app.appointmentDate)}</td>
                    <td className="px-4 py-3 font-semibold">{app.appointmentTime}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Weekly Availability Configuration */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Weekly Schedule & Consultation Hours</h3>
              <p className="text-xs text-slate-500">Configure consultation times for each day of the week</p>
            </div>
            <button
              onClick={handleSaveAvailability}
              disabled={savingAvail}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {savingAvail ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>

          <div className="space-y-3">
            {availabilityList.map((slot, idx) => (
              <div key={slot.dayOfWeek} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70 gap-4">
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    checked={slot.available}
                    onChange={(e) => handleAvailChange(idx, 'available', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="font-bold text-xs text-slate-800">{slot.dayOfWeek}</span>
                </div>

                <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Start Time</span>
                    <input
                      type="text"
                      value={slot.startTime}
                      onChange={(e) => handleAvailChange(idx, 'startTime', e.target.value)}
                      disabled={!slot.available}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-teal-500 disabled:opacity-50 w-24"
                    />
                  </div>

                  <span className="text-slate-400 pt-4">to</span>

                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">End Time</span>
                    <input
                      type="text"
                      value={slot.endTime}
                      onChange={(e) => handleAvailChange(idx, 'endTime', e.target.value)}
                      disabled={!slot.available}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-teal-500 disabled:opacity-50 w-24"
                    />
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${slot.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                  {slot.available ? 'Active' : 'Off Day'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
