import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/me', data);
    return res.data;
  }
};
