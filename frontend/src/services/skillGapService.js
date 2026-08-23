import api from './api';

export const skillGapService = {
  analyzeGap: async (payload) => {
    const res = await api.post('/advisor/analyze', payload);
    return res.data.data;
  },

  getHistory: async () => {
    const res = await api.get('/advisor/history');
    return res.data.data;
  },
};
