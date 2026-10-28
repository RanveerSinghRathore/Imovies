export const MOCK_MOVIES = [
  {
    _id: '6ae225ff09d2ce3741be7c22',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 166,
    certificate: 'UA',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh'],
    poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGUgkZDctNWY0MC00M2Q4LWFhOWQtMWI3ZTk2OGM4ODVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2024-03-01T00:00:00.000Z',
    averageRating: 8.9,
    totalRatings: 3200,
    isActive: true,
  },
  {
    _id: '6ae2291ea4b2f53eedc5dfde',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 192,
    certificate: 'UA',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
    poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFiNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE3NDM@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2022-12-16T00:00:00.000Z',
    averageRating: 7.8,
    totalRatings: 2800,
    isActive: true,
  },
  {
    _id: '6ae225ff09d2ce3741be7c21',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 181,
    certificate: 'UA',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2019-04-26T00:00:00.000Z',
    averageRating: 8.4,
    totalRatings: 4900,
    isActive: true,
  },
  {
    _id: '6ae225ff09d2ce3741be7c1f',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 169,
    certificate: 'UA',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2014-11-07T00:00:00.000Z',
    averageRating: 8.7,
    totalRatings: 5600,
    isActive: true,
  },
  {
    _id: '6ae225ff09d2ce3741be7c20',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil'],
    duration: 148,
    certificate: 'UA',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Ken Watanabe'],
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2010-07-16T00:00:00.000Z',
    averageRating: 8.8,
    totalRatings: 6100,
    isActive: true,
  },
  {
    _id: '6ae225ff09d2ce3741be7c1e',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['English', 'Hindi'],
    duration: 152,
    certificate: 'UA',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Maggie Gyllenhaal'],
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2008-07-18T00:00:00.000Z',
    averageRating: 9.0,
    totalRatings: 7200,
    isActive: true,
  },
];

const now = new Date();
const todayShow = (h, m = 0) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const tomorrowShow = (h, m = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const MOCK_THEATRE_SHOWS = [
  {
    theatre: {
      _id: 'theatre_mumbai_pvr',
      name: 'PVR Cinemas: Phoenix Palladium',
      city: 'Mumbai',
      address: 'Lower Parel, Phoenix Mills Compound, Mumbai 400013',
    },
    shows: [
      {
        _id: 'show_dune_1',
        screenName: 'IMAX Laser Screen 1',
        language: 'English',
        startTime: todayShow(16, 30),
        endTime: todayShow(19, 15),
        price: 350,
      },
      {
        _id: 'show_dune_2',
        screenName: '4DX Screen 2',
        language: 'Hindi',
        startTime: todayShow(20, 15),
        endTime: todayShow(23, 0),
        price: 300,
      },
      {
        _id: 'show_dune_3',
        screenName: 'IMAX Laser Screen 1',
        language: 'English',
        startTime: tomorrowShow(14, 0),
        endTime: tomorrowShow(16, 45),
        price: 320,
      },
    ],
  },
  {
    theatre: {
      _id: 'theatre_inox_bangalore',
      name: 'INOX Megaplex',
      city: 'Bangalore',
      address: 'Forum Mall, Koramangala, Bangalore 560095',
    },
    shows: [
      {
        _id: 'show_avatar_1',
        screenName: 'Screen A (Dolby Atmos)',
        language: 'English',
        startTime: todayShow(18, 0),
        endTime: todayShow(21, 15),
        price: 380,
      },
      {
        _id: 'show_avatar_2',
        screenName: 'Screen B',
        language: 'Hindi',
        startTime: tomorrowShow(19, 30),
        endTime: tomorrowShow(22, 45),
        price: 280,
      },
    ],
  },
];

export const MOCK_CITIES = ['Mumbai', 'Bangalore', 'Delhi-NCR', 'Hyderabad', 'Chennai', 'Pune'];
