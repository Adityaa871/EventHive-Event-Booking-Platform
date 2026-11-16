import api from './api';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data?.data || res.data;
};

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data?.data || res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data?.data || res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.patch('/auth/profile', profileData);
  return res.data?.data || res.data;
};

export const getUsers = async (params = {}) => {
  const res = await api.get('/auth/users', { params });
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await api.patch(`/auth/users/${userId}/toggle-status`);
  return res.data?.data || res.data;
};
