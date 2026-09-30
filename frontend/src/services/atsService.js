import api from './api';

export const atsService = {
  getPipeline: async (targetRole) => {
    const res = await api.get('/ats/pipeline', { params: { targetRole } });
    return res.data.data;
  },

  scheduleInterview: async (payload) => {
    const res = await api.post('/ats/schedule', payload);
    return res.data.data;
  },

  cancelInterview: async (id) => {
    const res = await api.delete(`/ats/interviews/${id}`);
    return res.data.data;
  }
};
