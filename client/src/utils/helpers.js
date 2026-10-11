// Format price in Indian currency
export const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

// Format date to readable string
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// Capitalize first letter of a string
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Truncate text to maxLength characters
export const truncate = (str, maxLength = 120) =>
  str && str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

// Get status badge CSS class
export const getStatusClass = (status) => {
  const map = {
    new: 'status-new',
    contacted: 'status-contacted',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'bg-secondary text-white';
};

// Extract API error message from Axios error
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
};

