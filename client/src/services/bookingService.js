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

export const getMyBookings = async () => {
  const res = await api.get('/bookings/my-bookings');
  return res.data?.data || res.data;
};

export const getBooking = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data?.data || res.data;
};

export const updateBooking = async (id, data) => {
  const res = await api.patch(`/bookings/${id}`, data);
  return res.data?.data || res.data;
};

export const updateBookingStatus = async (id, data) => {
  const res = await api.patch(`/bookings/${id}/status`, data);
  return res.data?.data || res.data;
};

export const requestCancellation = async (id, reason) => {
  const res = await api.post(`/bookings/${id}/cancel-request`, { reason });
  return res.data?.data || res.data;
};

export const requestReschedule = async (id, newDate, reason) => {
  const res = await api.post(`/bookings/${id}/reschedule-request`, { newDate, reason });
  return res.data?.data || res.data;
};

export const reviewCancellation = async (id, approved, adminResponse) => {
  const res = await api.patch(`/bookings/${id}/cancellation-review`, { approved, adminResponse });
  return res.data?.data || res.data;
};

export const reviewReschedule = async (id, approved, adminResponse) => {
  const res = await api.patch(`/bookings/${id}/reschedule-review`, { approved, adminResponse });
  return res.data?.data || res.data;
};

export const downloadInvoice = async (id, filename = 'EventHive-Invoice.pdf') => {
  const res = await api.get(`/bookings/${id}/invoice`, { responseType: 'blob' });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const getBookingStats = async () => {
  const res = await api.get('/bookings/stats/summary');
  return res.data?.data || res.data;
};
