import api from './api';

export const checkAvailability = async (date, packageId = null) => {
  const params = { date };
  if (packageId) params.packageId = packageId;
  const res = await api.get('/availability/check', { params });
  return res.data;
};

export const getMonthAvailability = async (year, month, packageId = null) => {
  const params = { year, month };
  if (packageId) params.packageId = packageId;
  const res = await api.get('/availability/month', { params });
  return res.data?.data || res.data;
};

export const getBlockedDates = async () => {
  const res = await api.get('/availability/admin-list');
  return res.data?.data || res.data;
};

export const blockDate = async (data) => {
  const res = await api.post('/availability/block', data);
  return res.data?.data || res.data;
};

export const unblockDate = async (id) => {
  const res = await api.delete(`/availability/unblock/${id}`);
  return res.data;
};
