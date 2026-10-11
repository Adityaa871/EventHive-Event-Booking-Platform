import api from './api';

export const createBooking = async (data) => {
  const res = await api.post('/bookings', data);
  return res.data?.data || res.data;
};

export const getBookings = async (params = {}) => {
  const res = await api.get('/bookings', { params });
  const list = res.data?.data || [];
  const pagination = res.data?.pagination || {};
  return {
    ...res.data,
    bookings: list,
    data: list,
    total: pagination.total || list.length,
    totalPages: pagination.pages || 1,
    page: pagination.page || 1,
  };
};

export const getBooking = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data?.data || res.data;
};

export const updateBooking = async (id, data) => {
  const res = await api.patch(`/bookings/${id}`, data);
  return res.data?.data || res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const getBookingStats = async () => {
  const res = await api.get('/bookings/stats/summary');
  return res.data?.data || res.data;
};
