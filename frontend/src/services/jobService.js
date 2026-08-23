import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data.data;
  },

  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data.data;
  },

  createJob: async (jobData) => {
    const res = await api.post('/jobs', jobData);
    return res.data.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },

  getAllSkills: async () => {
    const res = await api.get('/skills');
    return res.data.data;
  },

  getAllCourses: async () => {
    const res = await api.get('/courses');
    return res.data.data;
  },
};
