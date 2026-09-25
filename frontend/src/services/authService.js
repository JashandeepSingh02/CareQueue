import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('carequeue_token', response.data.token);
      localStorage.setItem('carequeue_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('carequeue_token', response.data.token);
      localStorage.setItem('carequeue_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, newPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword });
  },

  logout: () => {
    localStorage.removeItem('carequeue_token');
    localStorage.removeItem('carequeue_user');
  },

  getCurrentUserFromStorage: () => {
    const userStr = localStorage.getItem('carequeue_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};
