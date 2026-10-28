import api from './axios.js';
import { MOCK_CITIES } from '../utils/mockData.js';

export const theatreApi = {
  getCities: async () => {
    try {
      const res = await api.get('/theatres/cities');
      return res.data;
    } catch {
      return {
        success: true,
        data: MOCK_CITIES,
      };
    }
  },

  getTheatres: async (params = {}) => {
    try {
      const res = await api.get('/theatres', { params });
      return res.data;
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  },
};
