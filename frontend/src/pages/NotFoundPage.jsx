import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <Activity className="w-16 h-16 text-teal-600 mb-4 animate-bounce" />
    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 — Page Not Found</h1>
    <p className="text-sm text-slate-500 max-w-md mb-6">
      The requested page or queue portal route does not exist. Please return to the homepage or your dashboard.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
    >
      <ArrowLeft className="w-4 h-4" /> Return to CareQueue Home
    </Link>
  </div>
);
