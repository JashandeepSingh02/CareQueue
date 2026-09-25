import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, StatusBadge, QueueBadge } from '../components/UIHelpers';
import { Toast } from '../components/Toast';
import { Calendar, Clock, User, Stethoscope, AlertCircle, ArrowRight, XCircle, Eye } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data || []);
    } catch (err) {
      setToast({ message: 'Failed to load appointments', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await appointmentService.cancelAppointment(id);
      setToast({ message: 'Appointment cancelled successfully.', type: 'success' });
      fetchAppointments();
    } catch (err) {
      setToast({ message: err.message || 'Failed to cancel appointment', type: 'error' });
    }
  };

  // Find upcoming active appointment (PENDING or ACCEPTED)
  const upcomingAppointment = appointments.find(
    (a) => a.status === 'ACCEPTED' || a.status === 'PENDING'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">PATIENT PORTAL</span>
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.fullName || 'Patient'}!</h1>
          <p className="text-sm text-slate-300">
            Track your appointment queues, consult doctors, and manage healthcare schedules.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold rounded-xl shadow-lg transition-all text-sm shrink-0"
        >
          + Book New Appointment
        </Link>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching your appointments..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upcoming Featured Appointment & Queue Status */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Next Upcoming Appointment</h2>

            {upcomingAppointment ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <StatusBadge status={upcomingAppointment.status} />
                  <QueueBadge number={upcomingAppointment.queueNumber} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{upcomingAppointment.doctorName}</h4>
                      <p className="text-xs text-slate-500">{upcomingAppointment.specialization}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Date</span>
                      <span className="font-bold text-slate-800">{formatDate(upcomingAppointment.appointmentDate)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Slot Time</span>
                      <span className="font-bold text-slate-800">{upcomingAppointment.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/appointments/doctor/${upcomingAppointment.doctorId}/queue`}
                    className="flex-1 text-center py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Live Queue Board
                  </Link>

                  {upcomingAppointment.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelAppointment(upcomingAppointment.id)}
                      className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                      title="Cancel Appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800">No Upcoming Appointments</h4>
                  <p className="text-xs text-slate-500 mt-1">Book a consultation slot with a specialist to receive your Queue Number.</p>
                </div>
                <Link
                  to="/doctors"
                  className="inline-block py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Browse Doctors
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Complete Appointment History Table */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Appointment History</h2>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              {appointments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No appointment records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Queue #</th>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-teal-700">
                            #{app.queueNumber}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 block">{app.doctorName}</span>
                            <span className="text-[10px] text-slate-400">{app.specialization}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="block font-semibold">{formatDate(app.appointmentDate)}</span>
                            <span className="text-[10px] text-slate-400">{app.appointmentTime}</span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {app.status === 'PENDING' ? (
                              <button
                                onClick={() => handleCancelAppointment(app.id)}
                                className="text-rose-600 hover:text-rose-800 font-bold hover:underline"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-slate-400">—</span>
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

        </div>
      )}

    </div>
  );
};
