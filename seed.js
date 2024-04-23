import mongoose from 'mongoose';

import {Genre} from './src/models/Genre.js';
import {Movie} from './src/models/Movie.js';

const data = [
  {
    name: 'Comedy',
    movies: [
      {title: 'Airplane!', numberInStock: 10, dailyRentalRate: 2},
      {title: 'The Hangover', numberInStock: 15, dailyRentalRate: 3},
      {title: 'Wedding Crashers', numberInStock: 20, dailyRentalRate: 3},
    ],
  },
  {
    name: 'Action',
    movies: [
      {title: 'Die Hard', numberInStock: 12, dailyRentalRate: 3},
      {
        title: 'Terminator 2: Judgment Day',
        numberInStock: 18,
        dailyRentalRate: 3,
      },
      {title: 'The Dark Knight', numberInStock: 20, dailyRentalRate: 3},
    ],
  },
  {
    name: 'Romance',
    movies: [
      {title: 'Titanic', numberInStock: 20, dailyRentalRate: 3},
      {title: 'The Notebook', numberInStock: 15, dailyRentalRate: 3},
      {title: 'Pretty Woman', numberInStock: 18, dailyRentalRate: 3},
    ],
  },
  {
    name: 'Thriller',
    movies: [
      {
        title: 'The Silence of the Lambs',
        numberInStock: 15,
        dailyRentalRate: 3,
      },
      {title: 'Se7en', numberInStock: 18, dailyRentalRate: 3},
      {title: 'Psycho', numberInStock: 15, dailyRentalRate: 3},
    ],
  },
];

async function seed() {
  console.log(`Start seeding ...`);

  await mongoose.connect('mongodb://localhost:27017/vidly_api');

  await Movie.deleteMany({});
  await Genre.deleteMany({});

  setTimeout(async () => {
    for (let genre of data) {
      const {_id: genreId} = await new Genre({name: genre.name}).save();
      const movies = genre.movies.map(movie => ({
        ...movie,
        genre: {_id: genreId, name: genre.name},
      }));
      await Movie.insertMany(movies);
    }

    mongoose.disconnect();

    console.log(`Seeding finished...!!`);
  }, 1000);
}

seed();
