import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const getMeApi = () => api.get('/auth/me');

// Package Services
export const getPackagesApi = (params) => api.get('/packages', { params });
export const getPackageByIdApi = (id) => api.get(`/packages/${id}`);
export const createPackageApi = (data) => api.post('/packages', data);
export const updatePackageApi = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackageApi = (id) => api.delete(`/packages/${id}`);

// Booking Services
export const submitBookingApi = (data) => api.post('/bookings', data);
export const getBookingsApi = (params) => api.get('/bookings', { params });
export const getBookingByIdApi = (id) => api.get(`/bookings/${id}`);
export const updateBookingApi = (id, data) => api.patch(`/bookings/${id}`, data);
export const deleteBookingApi = (id) => api.delete(`/bookings/${id}`);
export const getBookingStatsApi = () => api.get('/bookings/stats/summary');

// Health Check
export const checkHealthApi = () => api.get('/health');

export default api;

