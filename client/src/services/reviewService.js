import api from './api';

export const getPackageReviews = async (packageId) => {
  const res = await api.get(`/reviews/package/${packageId}`);
  return res.data?.data || [];
};

export const createReview = async (reviewData) => {
  const res = await api.post('/reviews', reviewData);
  return res.data?.data || res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.patch(`/reviews/${id}`, reviewData);
  return res.data?.data || res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

export const getAdminReviews = async () => {
  const res = await api.get('/reviews/admin/list');
  return res.data?.data || [];
};

export const moderateReview = async (id) => {
  const res = await api.patch(`/reviews/${id}/moderate`);
  return res.data?.data || res.data;
};
