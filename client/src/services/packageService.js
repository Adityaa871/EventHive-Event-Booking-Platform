import api from './api';

export const getPackages = async (params = {}) => {
  const res = await api.get('/packages', { params });
  const list = res.data?.data || [];
  const pagination = res.data?.pagination || {};
  return {
    ...res.data,
    packages: list,
    data: list,
    total: pagination.total || list.length,
    totalPages: pagination.pages || 1,
    page: pagination.page || 1,
  };
};

export const getPackage = async (id) => {
  const res = await api.get(`/packages/${id}`);
  return res.data?.data || res.data;
};

export const getPackageById = getPackage;

export const createPackage = async (data) => {
  const res = await api.post('/packages', data);
  return res.data?.data || res.data;
};

export const updatePackage = async (id, data) => {
  const res = await api.put(`/packages/${id}`, data);
  return res.data?.data || res.data;
};

export const deletePackage = async (id) => {
  const res = await api.delete(`/packages/${id}`);
  return res.data;
};
