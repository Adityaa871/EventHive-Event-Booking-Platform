import api from './api';

export const validateCoupon = async (code, bookingAmount) => {
  const res = await api.post('/coupons/validate', { code, bookingAmount });
  return res.data;
};

export const getCoupons = async () => {
  const res = await api.get('/coupons');
  return res.data?.data || res.data;
};

export const createCoupon = async (data) => {
  const res = await api.post('/coupons', data);
  return res.data?.data || res.data;
};

export const updateCoupon = async (id, data) => {
  const res = await api.patch(`/coupons/${id}`, data);
  return res.data?.data || res.data;
};

export const deleteCoupon = async (id) => {
  const res = await api.delete(`/coupons/${id}`);
  return res.data;
};
