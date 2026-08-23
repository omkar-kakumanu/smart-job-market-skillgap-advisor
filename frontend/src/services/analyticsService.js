import api from './api';

export const analyticsService = {
  getMarketTrends: async () => {
    const res = await api.get('/analytics/trends');
    return res.data.data;
  },
};
