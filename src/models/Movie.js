import mongoose from 'mongoose';
import zod from 'zod';
import {genreSchema} from './Genre.js';

// Defining Schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true,
  },
  genre: {
    type: genreSchema,
    ref: 'Genre',
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Creating Model
const Movie = mongoose.model('Movie', movieSchema);

// Validation Logic
const validateMovie = movie => {
  const schema = zod
    .object({
      title: zod
        .string({
          required_error: 'title is required',
          invalid_type_error: 'Title must be a string',
        })
        .min(3, {message: 'Must be 3 or more characters long'})
        .max(255, {message: 'Must be 50 or fewer characters long'}),
      genreId: zod
        .string({
          required_error: 'genreId is required',
          invalid_type_error: 'GenreId must be a string',
        })
        .refine(val => val.length === 24, {message: 'Invalid genreId'}),
      numberInStock: zod
        .number({
          required_error: 'numberInStock is required',
          invalid_type_error: 'numberInStock must be a number',
        })
        .nonnegative(),
      dailyRentalRate: zod
        .number({
          required_error: 'dailyRentalRate is required',
          invalid_type_error: 'dailyRentalRate must be a number',
        })
        .nonnegative(),
    })
    .strict();

  return schema.safeParse(movie);
};

export {Movie, validateMovie as validate};
