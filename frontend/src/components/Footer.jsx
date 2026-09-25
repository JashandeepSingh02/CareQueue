import React from 'react';
import { Activity, Heart, ShieldCheck, PhoneCall, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">CareQueue</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Smart clinic appointment scheduling and automated queue management system. Eliminating clinic wait times for patients and streamlining doctor workflows.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Find Doctors</Link></li>
            <li><Link to="/register" className="hover:text-teal-400 transition-colors">Patient Portal</Link></li>
            <li><Link to="/login" className="hover:text-teal-400 transition-colors">Doctor Portal</Link></li>
            <li><Link to="/login" className="hover:text-teal-400 transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">System Features</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> Automated Queue #</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> Real-time Queue Tracking</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> Doctor Schedule Management</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> Password Recovery</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-teal-400" />
              <span>+1 (800) 555-CARE</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>support@carequeue.com</span>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} CareQueue. All rights reserved. Enterprise Healthcare SaaS.</p>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Spring Boot, MongoDB & React</span>
        </div>
      </div>
    </div>
  </footer>
);
