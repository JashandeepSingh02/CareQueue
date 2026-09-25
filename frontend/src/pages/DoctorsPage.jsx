import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { LoadingSpinner } from '../components/UIHelpers';
import { Search, Stethoscope, Award, Calendar, ArrowRight, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const specializations = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'];

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpec]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctors(selectedSpec);
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.qualification && doc.qualification.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Find Specialists & Book Appointment</h1>
        <p className="text-slate-600 text-sm">
          Select a doctor, view their weekly availability slots, and receive an automated Queue Number.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Specialization Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpec === spec
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by doctor name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

      </div>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching active doctors..." />
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Doctors Found</h3>
          <p className="text-xs text-slate-500">Try selecting a different specialization or adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={doc.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                    alt={doc.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                      {doc.fullName}
                    </h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold text-[11px] border border-teal-100 mt-1">
                      {doc.specialization}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.qualification}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.bio || 'Board-certified specialist dedicated to patient-centered clinical excellence.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                    <span className="font-bold text-slate-800">{doc.experience || 5}+ Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Fee</span>
                    <span className="font-bold text-teal-700">{formatCurrency(doc.consultationFee)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment & Get Queue #
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
