import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';

const MOVIES = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 166,
    certificate: 'UA',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh'],
    poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGUgkZDctNWY0MC00M2Q4LWFhOWQtMWI3ZTk2OGM4ODVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: new Date('2024-03-01'),
    isActive: true,
  },
  {
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 192,
    certificate: 'UA',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
    poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFiNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE3NDM@._V1_FMjpg_UX1000_.jpg',
    releaseDate: new Date('2022-12-16'),
    isActive: true,
  },
];

const futureDate = (daysFromNow, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Upsert both movies
    const savedMovies = [];
    for (const mData of MOVIES) {
      let movie = await Movie.findOne({ title: mData.title });
      if (movie) {
        Object.assign(movie, mData);
        await movie.save();
        console.log(`Updated movie: ${movie.title}`);
      } else {
        movie = await Movie.create(mData);
        console.log(`Created movie: ${movie.title}`);
      }
      savedMovies.push(movie);
    }

    // 2. Fetch or create theatres
    let theatres = await Theatre.find({ isActive: true });
    if (theatres.length === 0) {
      theatres = await Theatre.insertMany([
        {
          name: 'PVR Cinemas',
          city: 'Mumbai',
          address: 'Lower Parel, Phoenix Mills Compound, Mumbai 400013',
          screens: [
            { name: 'Screen 1', rows: 8, seatsPerRow: 16 },
            { name: 'Screen 2', rows: 6, seatsPerRow: 12 },
          ],
          isActive: true,
        },
        {
          name: 'INOX Megaplex',
          city: 'Bangalore',
          address: 'Forum Mall, Koramangala, Bangalore 560095',
          screens: [
            { name: 'Screen A', rows: 10, seatsPerRow: 20 },
            { name: 'Screen B', rows: 6, seatsPerRow: 12 },
          ],
          isActive: true,
        },
      ]);
      console.log('Created sample theatres');
    }

    const [dune, avatar] = savedMovies;
    const [pvr, inox] = theatres;

    // 3. Remove old shows for these two movies to avoid overlaps
    await Show.deleteMany({ movie: { $in: [dune._id, avatar._id] } });

    // 4. Create shows across next 4 days
    const showDocs = [
      // Today & tomorrow for Dune
      {
        movie: dune._id,
        theatre: pvr._id,
        screenName: pvr.screens[0].name,
        language: 'English',
        startTime: futureDate(0, 19, 30),
        endTime: new Date(futureDate(0, 19, 30).getTime() + (dune.duration + 15) * 60000),
        price: 350,
      },
      {
        movie: dune._id,
        theatre: pvr._id,
        screenName: pvr.screens[1].name,
        language: 'Hindi',
        startTime: futureDate(1, 14, 0),
        endTime: new Date(futureDate(1, 14, 0).getTime() + (dune.duration + 15) * 60000),
        price: 280,
      },
      {
        movie: dune._id,
        theatre: inox ? inox._id : pvr._id,
        screenName: inox ? inox.screens[0].name : pvr.screens[0].name,
        language: 'English',
        startTime: futureDate(1, 18, 0),
        endTime: new Date(futureDate(1, 18, 0).getTime() + (dune.duration + 15) * 60000),
        price: 320,
      },
      // Avatar shows
      {
        movie: avatar._id,
        theatre: pvr._id,
        screenName: pvr.screens[0].name,
        language: 'English',
        startTime: futureDate(0, 23, 0),
        endTime: new Date(futureDate(0, 23, 0).getTime() + (avatar.duration + 15) * 60000),
        price: 400,
      },
      {
        movie: avatar._id,
        theatre: pvr._id,
        screenName: pvr.screens[1].name,
        language: 'Hindi',
        startTime: futureDate(1, 17, 30),
        endTime: new Date(futureDate(1, 17, 30).getTime() + (avatar.duration + 15) * 60000),
        price: 300,
      },
      {
        movie: avatar._id,
        theatre: inox ? inox._id : pvr._id,
        screenName: inox ? inox.screens[0].name : pvr.screens[0].name,
        language: 'English',
        startTime: futureDate(2, 20, 0),
        endTime: new Date(futureDate(2, 20, 0).getTime() + (avatar.duration + 15) * 60000),
        price: 380,
      },
    ];

    const insertedShows = await Show.insertMany(showDocs);
    console.log(`Successfully created ${insertedShows.length} shows for Dune and Avatar!`);
  } catch (err) {
    console.error('Error setting up movies:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  }
}

run();
