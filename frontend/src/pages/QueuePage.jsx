import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { LoadingSpinner, StatusBadge, QueueBadge } from '../components/UIHelpers';
import { Clock, Stethoscope, RefreshCw, UserCheck, Calendar } from 'lucide-react';

export const QueuePage = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchQueue();
    // Auto refresh queue every 15 seconds
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [doctorId, dateParam]);

  const fetchQueue = async () => {
    try {
      const data = await appointmentService.getDoctorQueue(doctorId, dateParam);
      setQueueData(data);
    } catch (err) {
      console.error('Failed to load queue board', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchQueue();
  };

  if (loading) {
    return <LoadingSpinner text="Fetching real-time clinic queue board..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">LIVE QUEUE MONITOR</span>
          </div>
          <h1 className="text-3xl font-extrabold">{queueData?.doctorName || 'Doctor Queue'}</h1>
          <p className="text-xs text-slate-300">{queueData?.specialization} • Date: {queueData?.date}</p>
        </div>

        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-400' : ''}`} /> Refresh Board
        </button>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Currently Consulting */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 border border-teal-700/50 shadow-xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">CURRENT PATIENT IN ROOM</span>
          <div className="text-6xl font-black text-teal-300 py-2">
            {queueData?.currentQueueNumber ? `Queue #${queueData.currentQueueNumber}` : '—'}
          </div>
          <div className="pt-4 border-t border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-bold block">Patient Name</span>
            <span className="text-lg font-extrabold text-white">{queueData?.currentPatientName || 'None'}</span>
          </div>
        </div>

        {/* Next Up */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">NEXT IN LINE</span>
          <div className="text-6xl font-black text-slate-800 py-2">
            {queueData?.nextQueueNumber ? `Queue #${queueData.nextQueueNumber}` : '—'}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 uppercase font-bold block">Patient Name</span>
            <span className="text-lg font-extrabold text-slate-900">{queueData?.nextPatientName || 'None'}</span>
          </div>
        </div>

      </div>

      {/* Complete Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Today's Sequence ({queueData?.appointments?.length || 0})</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Queue #</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Slot Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueData?.appointments?.map((app) => (
                <tr key={app.id} className={app.queueNumber === queueData.currentQueueNumber ? 'bg-teal-50/70 font-bold' : ''}>
                  <td className="px-4 py-3 text-teal-700 font-black text-sm">#{app.queueNumber}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{app.patientName}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{app.appointmentTime}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
