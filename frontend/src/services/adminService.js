import api from './api';

export const adminService = {
  getStatistics: async () => {
    const res = await api.get('/admin/statistics');
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  getAllDoctors: async () => {
    const res = await api.get('/admin/doctors');
    return res.data;
  },

  getAllAppointments: async () => {
    const res = await api.get('/admin/appointments');
    return res.data;
  }
};
