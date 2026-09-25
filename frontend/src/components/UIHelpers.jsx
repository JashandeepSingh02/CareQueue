import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
    <p className="mt-3 text-sm font-medium text-slate-500">{text}</p>
  </div>
);

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'ACCEPTED':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-600 border-slate-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export const QueueBadge = ({ number }) => (
  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-bold text-sm shadow-sm">
    Queue #{number}
  </div>
);
