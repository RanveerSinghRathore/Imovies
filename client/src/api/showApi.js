import api from './axios.js';
import { MOCK_MOVIES, MOCK_THEATRE_SHOWS } from '../utils/mockData.js';

export const showApi = {
  getShows: async (params = {}) => {
    try {
      const res = await api.get('/shows', { params });
      return res.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  getShow: async (id) => {
    try {
      const res = await api.get(`/shows/${id}`);
      return res.data;
    } catch {
      const allShows = MOCK_THEATRE_SHOWS.flatMap((t) =>
        t.shows.map((s) => ({
          ...s,
          movie: MOCK_MOVIES[0],
          theatre: t.theatre,
        }))
      );
      const show = allShows.find((s) => s._id === id) || allShows[0];
      return { success: true, data: show };
    }
  },

  getShowSeats: async (id) => {
    try {
      const res = await api.get(`/shows/${id}/seats`);
      return res.data;
    } catch {
      const seats = [];
      const rows = 8;
      const seatsPerRow = 16;
      for (let r = 0; r < rows; r++) {
        const rowLetter = String.fromCharCode(65 + r);
        for (let n = 1; n <= seatsPerRow; n++) {
          seats.push({
            label: `${rowLetter}${n}`,
            row: rowLetter,
            number: n,
            status: n % 5 === 0 ? 'booked' : 'available',
            isMine: false,
          });
        }
      }
      return {
        success: true,
        data: {
          layout: { rows, seatsPerRow },
          price: 350,
          seats,
        },
      };
    }
  },
};
