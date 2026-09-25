import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UIHelpers';
import { Toast } from '../components/Toast';
import { Calendar, Clock, Award, DollarSign, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [doctor, selectedDate]);

  const fetchDoctorDetails = async () => {
    setLoadingDoctor(true);
    try {
      const data = await doctorService.getDoctorById(id);
      setDoctor(data);
    } catch (err) {
      setToast({ message: 'Failed to load doctor profile', type: 'error' });
    } finally {
      setLoadingDoctor(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    setSelectedTime('');
    try {
      const dateObj = new Date(selectedDate + 'T00:00:00');
      const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const dayOfWeek = dayNames[dateObj.getDay()];

      const slots = await doctorService.getDoctorSlots(id, dayOfWeek);
      setAvailableSlots(slots || []);
    } catch (err) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'ROLE_PATIENT') {
      setToast({ message: 'Only registered patients can book appointments. Switch to a patient account.', type: 'error' });
      return;
    }

    if (!selectedTime) {
      setToast({ message: 'Please select a valid consultation time slot.', type: 'error' });
      return;
    }

    setBookingLoading(true);
    try {
      const result = await appointmentService.bookAppointment({
        doctorId: id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: reason || 'General consultation'
      });

      setBookedAppointment(result);
      setToast({ message: `Appointment booked successfully! Queue #${result.queueNumber} assigned.`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to book appointment', type: 'error' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingDoctor) {
    return <LoadingSpinner text="Loading doctor profile & schedule..." />;
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Doctor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Doctor Search
      </button>

      {bookedAppointment ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Appointment Confirmed!</h2>
            <p className="text-sm text-slate-600">Your appointment is registered with {doctor.fullName}</p>
          </div>

          {/* Queue Ticket Card */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">YOUR ASSIGNED QUEUE NUMBER</span>
            <div className="text-5xl font-black text-teal-300">
              Queue #{bookedAppointment.queueNumber}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-700/80 pt-4 text-slate-300">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Date</span>
                <span className="font-bold">{bookedAppointment.appointmentDate}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Slot Time</span>
                <span className="font-bold">{bookedAppointment.appointmentTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Go to Patient Dashboard
            </button>
            <button
              onClick={() => navigate(`/appointments/doctor/${doctor.id}/queue`)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              View Live Queue Board
            </button>
          </div>
        </div>
      ) : (
        /* Doctor Profile & Booking Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Doctor Information */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="text-center sm:text-left space-y-4">
              <img
                src={doctor.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                alt={doctor.fullName}
                className="w-24 h-24 rounded-3xl object-cover border border-slate-200 shadow-sm mx-auto sm:mx-0"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{doctor.fullName}</h1>
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs border border-teal-100 mt-1">
                  {doctor.specialization}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {doctor.bio || 'Dedicated medical professional bringing years of expertise in diagnosis and patient care.'}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3 text-slate-700">
                <Award className="w-4 h-4 text-teal-600" />
                <span><strong>Qualifications:</strong> {doctor.qualification || 'MD, Board Certified'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="w-4 h-4 text-teal-600" />
                <span><strong>Experience:</strong> {doctor.experience || 5} Years</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span><strong>Consultation Fee:</strong> {formatCurrency(doctor.consultationFee)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Date & Slot Selector */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Select Date & Consultation Slot</h2>
              <p className="text-xs text-slate-500 mt-0.5">Queue numbers are generated automatically upon booking</p>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-6">
              
              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Choose Date
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Slots Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Choose Available Time Slot
                </label>

                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-slate-400">Checking slot availability...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>No available consultation slots for this doctor on the selected date. Please pick another date.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedTime === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.02]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Reason for Visit (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Annual health checkup, persistent headache..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading || !selectedTime}
                className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all text-sm disabled:opacity-50"
              >
                {bookingLoading ? 'Processing Booking...' : 'Confirm Appointment & Get Queue #'}
              </button>

            </form>
          </div>

        </div>
      )}

    </div>
  );
};
