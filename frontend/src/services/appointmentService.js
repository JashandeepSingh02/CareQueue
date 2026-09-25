import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const res = await api.post('/appointments', appointmentData);
    return res.data;
  },

  getPatientAppointments: async () => {
    const res = await api.get('/appointments/my');
    return res.data;
  },

  getDoctorAppointments: async () => {
    const res = await api.get('/appointments/doctor/my');
    return res.data;
  },

  getDoctorQueue: async (doctorId, date) => {
    const url = date 
      ? `/appointments/doctor/${doctorId}/queue?date=${date}`
      : `/appointments/doctor/${doctorId}/queue`;
    const res = await api.get(url);
    return res.data;
  },

  updateStatus: async (id, status, notes = '') => {
    const res = await api.put(`/appointments/${id}/status`, { status, notes });
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  }
};
