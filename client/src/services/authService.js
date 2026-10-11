import api from './api';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data?.data || res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data?.data || res.data;
};
