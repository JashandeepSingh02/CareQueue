import api from './api';

export const doctorService = {
  getDoctors: async (specialization) => {
    const url = specialization && specialization !== 'All' 
      ? `/doctors?specialization=${encodeURIComponent(specialization)}`
      : '/doctors';
    const res = await api.get(url);
    return res.data;
  },

  getDoctorById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  getMyDoctorProfile: async () => {
    const res = await api.get('/doctors/me');
    return res.data;
  },

  getDoctorSlots: async (id, dayOfWeek) => {
    const res = await api.get(`/doctors/${id}/availability?dayOfWeek=${dayOfWeek}`);
    return res.data;
  },

  updateAvailability: async (id, availability) => {
    const res = await api.put(`/doctors/${id}/availability`, { availability });
    return res.data;
  },

  createDoctor: async (doctorData) => {
    const res = await api.post('/doctors', doctorData);
    return res.data;
  },

  updateDoctor: async (id, doctorData) => {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  },

  deleteDoctor: async (id) => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  }
};
