import mongoose from 'mongoose';
import zod from 'zod';

import {customerSchema} from './Customer.js';

// Defining Schema
const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
    ref: 'Customer',
  },

  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },

  dateOut: {
    type: Date,
    default: Date.now(),
    required: true,
  },

  dateReturned: {
    type: Date,
  },

  rentalFee: {
    type: Number,
    min: 0,
  },
});

// Creating Model
const Rental = mongoose.model('Rental', rentalSchema);

// Validation Logic
const validateRental = rental => {
  const schema = zod
    .object({
      customerId: zod
        .string({
          required_error: 'customerId is required',
          invalid_type_error: 'customerId must be a string',
        })
        .refine(val => val.length === 24, {
          message: 'Invalid customerId',
        }),
      movieId: zod
        .string({
          required_error: 'movieId is required',
          invalid_type_error: 'movieId must be a string',
        })
        .refine(val => val.length === 24, {
          message: 'Invalid movieId',
        }),
    })
    .strict();

  return schema.safeParse(rental);
};

export {Rental, validateRental as validate};
