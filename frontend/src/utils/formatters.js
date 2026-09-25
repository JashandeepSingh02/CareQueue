export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'REJECTED':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};
