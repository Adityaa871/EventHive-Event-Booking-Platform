export const CATEGORIES = [
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'wedding', label: '💍 Wedding' },
  { value: 'corporate', label: '🏢 Corporate' },
  { value: 'anniversary', label: '💛 Anniversary' },
  { value: 'other', label: '🎉 Other' },
];

export const BOOKING_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

