import api from './api';

export const resumeService = {
  parseResume: async ({ fileName, rawText }) => {
    const res = await api.post('/resume/parse', { fileName, rawText });
    return res.data.data;
  }
};
