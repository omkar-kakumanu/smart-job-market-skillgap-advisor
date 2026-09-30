import api from './api';

export const voiceScreeningService = {
  getQuestions: async () => {
    const res = await api.get('/voice-screening/questions');
    return res.data.data;
  },

  evaluateAnswer: async (payload) => {
    const res = await api.post('/voice-screening/evaluate', payload);
    return res.data.data;
  },

  saveRecord: async (payload) => {
    const res = await api.post('/voice-screening/record', payload);
    return res.data.data;
  },

  getHistory: async () => {
    const res = await api.get('/voice-screening/history');
    return res.data.data;
  }
};
