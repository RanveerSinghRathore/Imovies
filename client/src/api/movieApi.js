import api from './axios.js';
import { MOCK_MOVIES, MOCK_THEATRE_SHOWS } from '../utils/mockData.js';

export const movieApi = {
  getMovies: async (params = {}) => {
    try {
      const res = await api.get('/movies', { params });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: MOCK_MOVIES, pagination: { total: MOCK_MOVIES.length, totalPages: 1 } };
    } catch {
      // Fallback for standalone/cloud deployments (e.g. Vercel) where backend is not yet attached
      let filtered = [...MOCK_MOVIES];
      if (params.search) {
        filtered = filtered.filter((m) =>
          m.title.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      if (params.genre) {
        filtered = filtered.filter((m) =>
          m.genres.some((g) => g.toLowerCase() === params.genre.toLowerCase())
        );
      }
      if (params.language) {
        filtered = filtered.filter((m) =>
          m.languages.some((l) => l.toLowerCase() === params.language.toLowerCase())
        );
      }
      return {
        success: true,
        data: filtered,
        pagination: {
          page: 1,
          limit: params.limit || 12,
          total: filtered.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  getMovie: async (id) => {
    try {
      const res = await api.get(`/movies/${id}`);
      return res.data;
    } catch {
      const movie = MOCK_MOVIES.find((m) => m._id === id) || MOCK_MOVIES[0];
      return { success: true, data: movie };
    }
  },

  getFilters: async () => {
    try {
      const res = await api.get('/movies/filters');
      return res.data;
    } catch {
      return {
        success: true,
        data: {
          genres: ['Action', 'Adventure', 'Sci-Fi', 'Drama', 'Crime', 'Fantasy'],
          languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
        },
      };
    }
  },

  getMovieShows: async (movieId, params = {}) => {
    try {
      const res = await api.get(`/movies/${movieId}/shows`, { params });
      return res.data;
    } catch {
      return {
        success: true,
        data: MOCK_THEATRE_SHOWS,
      };
    }
  },
};
