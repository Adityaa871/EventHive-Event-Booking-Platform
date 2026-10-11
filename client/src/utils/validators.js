// Client-side form validators

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Please enter a valid email address';
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone) ? '' : 'Enter a valid 10-digit Indian mobile number';
};

export const validateFutureDate = (date) => {
  if (!date) return 'Event date is required';
  return new Date(date) > new Date() ? '' : 'Event date must be in the future';
};

export const validateRequired = (value, fieldName = 'This field') => {
  return value && value.toString().trim() ? '' : `${fieldName} is required`;
};

export const validateMinNumber = (value, min, fieldName = 'Value') => {
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  return num >= min ? '' : `${fieldName} must be at least ${min}`;
};

