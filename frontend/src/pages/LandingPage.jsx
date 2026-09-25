import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, Shield, Calendar, Users, ArrowRight, CheckCircle2, ChevronDown, Stethoscope, Search } from 'lucide-react';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the automated Queue Number work?",
      a: "When you select an available doctor slot and confirm your booking, our backend automatically generates a sequential Queue Number (e.g. Queue #1, Queue #2) for that doctor and date. You can monitor your live queue position from your patient dashboard."
    },
    {
      q: "Can doctors adjust their availability hours?",
      a: "Yes! Doctors have full control over their weekly schedule in the Doctor Portal. They can configure working hours per day of the week, customize consultation slot durations, or temporarily deactivate availability."
    },
    {
      q: "Is CareQueue accessible on mobile devices?",
      a: "CareQueue is completely responsive and optimized for mobile phones, tablets, and desktop browsers, enabling seamless booking and real-time queue tracking anywhere."
    },
    {
      q: "What roles are available in the system?",
      a: "CareQueue supports three dedicated user roles: Patients (book and track appointments), Doctors (manage consultation queues and patient records), and System Administrators (oversee clinic operations, manage staff, and analyze metrics)."
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Activity className="w-4 h-4 text-teal-400 animate-pulse" /> Next-Gen Healthcare Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Smarter Healthcare. <br />
                <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                  Simpler Queues.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Transform your clinic experience. Book appointments online, receive instant automated queue numbers, and track your queue status in real time — eliminating long waiting room delays.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/doctors"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]"
                >
                  <Search className="w-5 h-5" /> Find & Book Doctor
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
                >
                  Create Patient Account <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <span className="block text-2xl font-extrabold text-white">99.8%</span>
                  <span className="text-xs text-slate-400">On-time Consultations</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-white">0 min</span>
                  <span className="text-xs text-slate-400">Unnecessary Waiting</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-white">24/7</span>
                  <span className="text-xs text-slate-400">Real-time Live Queue</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-slate-800/90 rounded-3xl p-6 border border-slate-700 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">
                      Q1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dr. Sarah Jenkins</h4>
                      <p className="text-xs text-slate-400">Cardiology Clinic</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    Live Now
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Patient In Room</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-extrabold text-teal-400">Queue #1</span>
                      <span className="text-sm text-slate-200 font-medium">John Doe</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/40">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next In Queue</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-slate-300">Queue #2</span>
                      <span className="text-sm text-slate-400">Estimated: 10:15 AM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/80 text-center">
                  <span className="text-xs text-slate-400">Live queue auto-updates for patients & staff</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How CareQueue Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">Simple Workflow</h2>
          <p className="text-3xl font-extrabold text-slate-900">How CareQueue Works in 3 Easy Steps</p>
          <p className="text-slate-600">Designed for speed, clarity, and zero clinic congestion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xl mb-6 border border-teal-100">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Find Your Specialist</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Browse top verified doctors by medical specialization, consultation fee, qualifications, and patient reviews.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xl mb-6 border border-teal-100">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Select Date & Time</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Choose an available slot directly synced with the doctor's weekly consultation hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xl mb-6 border border-teal-100">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Get Queue # & Track Live</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receive your automatically assigned Queue Number (e.g. Queue #1) and track the live consultation progress online.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison / Benefits */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Built For Patients & Doctors</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                A Modern SaaS Solution for Clinic Efficiency
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Automated Queue Number Generation</h4>
                    <p className="text-slate-600 text-xs mt-0.5">Strict backend queue logic guarantees fair, sequential order per doctor each day.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Flexible Schedule Configuration</h4>
                    <p className="text-slate-600 text-xs mt-0.5">Doctors customize exact consultation slots per day of the week with 1-click controls.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Role-Based Security & Control</h4>
                    <p className="text-slate-600 text-xs mt-0.5">Separate RBAC flows for Patients, Doctors, and Admins with BCrypt & JWT protection.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Users className="w-8 h-8 text-teal-600" />
                <h4 className="font-bold text-slate-900">Patients</h4>
                <p className="text-xs text-slate-500">Book, reschedule, track live queue position, and access appointment history anytime.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <Stethoscope className="w-8 h-8 text-teal-600" />
                <h4 className="font-bold text-slate-900">Doctors</h4>
                <p className="text-xs text-slate-500">Manage today's patient queue, mark consultations completed, and control availability.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 col-span-2">
                <Shield className="w-8 h-8 text-teal-600" />
                <h4 className="font-bold text-slate-900">Clinic Admins</h4>
                <p className="text-xs text-slate-500">Full system oversight: add and manage doctors, view global metrics, and audit appointments.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">Got Questions?</h2>
          <p className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-teal-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold">Ready for Stress-Free Clinic Visits?</h2>
            <p className="text-teal-100 text-sm md:text-base">
              Join thousands of patients and clinic professionals enjoying streamlined healthcare queuing today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-teal-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all hover:scale-105"
              >
                Register as Patient
              </Link>
              <Link
                to="/doctors"
                className="px-8 py-3.5 bg-teal-800/80 text-white font-bold rounded-xl border border-teal-600 hover:bg-teal-800 transition-all"
              >
                Browse Specializations
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
