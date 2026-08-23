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
};
