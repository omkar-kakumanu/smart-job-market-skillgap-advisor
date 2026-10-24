import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data.data;
  },

  addSkill: async (skillId, level, years) => {
    const res = await api.post(`/users/skills?skillId=${skillId}&level=${level}&years=${years}`);
    return res.data.data;
  },

  removeSkill: async (skillId) => {
    const res = await api.delete(`/users/skills/${skillId}`);
    return res.data;
  },

  setUserApproval: async (userId, approved) => {
    const res = await api.put(`/users/${userId}/approval?approved=${approved}`);
    return res.data;
  },

  getCandidateVoiceRecords: async (userId) => {
    const res = await api.get(`/voice-screening/candidate/${userId}`);
    return res.data.data;
  },

  getCandidateInterviews: async (userId) => {
    const res = await api.get(`/interviews/candidate/${userId}`);
    return res.data.data;
  },

  addCandidateSkill: async (userId, skillData) => {
    const res = await api.post(`/users/${userId}/skills`, skillData);
    return res.data.data;
  },

  deleteCandidateSkill: async (userId, skillId) => {
    const res = await api.delete(`/users/${userId}/skills/${skillId}`);
    return res.data;
  },

  updateCandidateProfile: async (userId, data) => {
    const res = await api.put(`/users/${userId}/profile`, data);
    return res.data.data;
  }
};
