import api from './api';

export const interviewService = {
  getQuestions: async ({ role = 'Full Stack Java Developer', category = 'ALL' } = {}) => {
    const res = await api.get('/interviews/questions', { params: { role, category } });
    return res.data.data;
  },

  evaluateResponse: async (payload) => {
    const res = await api.post('/interviews/evaluate', payload);
    return res.data.data;
  },

  saveAttempt: async (payload) => {
    const res = await api.post('/interviews/attempt', payload);
    return res.data.data;
  },

  getHistory: async () => {
    const res = await api.get('/interviews/history');
    return res.data.data;
  }
};
