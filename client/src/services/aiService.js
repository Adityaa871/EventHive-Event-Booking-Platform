import api from './api';

export const askAiAssistant = async ({ message, history = [], userPreferences = {} }) => {
  const res = await api.post('/ai/assistant', { message, history, userPreferences });
  return res.data?.data || res.data;
};
