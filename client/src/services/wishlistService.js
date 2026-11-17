import api from './api';

export const getWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data?.data || [];
};

export const addToWishlist = async (packageId) => {
  const res = await api.post(`/wishlist/${packageId}`);
  return res.data?.data || res.data;
};

export const removeFromWishlist = async (packageId) => {
  const res = await api.delete(`/wishlist/${packageId}`);
  return res.data?.data || res.data;
};
