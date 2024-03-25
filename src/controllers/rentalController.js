import mongoose from 'mongoose';

import {Customer} from '../models/Customer.js';
import {Movie} from '../models/Movie.js';
import {Rental, validate} from '../models/Rental.js';

// TODO: Add authorization for all

const getAllRentals = async (req, res) => {
  const rentals = await Rental.find({}, {__v: 0}).sort({dateOut: -1});

  res.send(rentals);
};

const getRentalById = async (req, res) => {
  const rental = await Rental.findById(req.params.id).select('-__v');
  if (!rental)
    return res.status(404).send('The rental with the given ID was not found');

  res.json(rental);
};

const createRental = async (req, res, next) => {
  let session;

  try {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.issues[0].message);

    // Starting Session
    session = await mongoose.startSession();
    session.startTransaction();

    const customer = await Customer.findById(req.body.customerId).session(
      session,
    );
    if (!customer) return res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId).session(session);
    if (!movie) return res.status(400).send('Invalid movie');
    if (movie.numberInStock === 0)
      return res.status(400).send('Movie not in stock.');

    const rental = new Rental({
      customer: {
        _id: req.body.customerId,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: req.body.movieId,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    await rental.save({session});

    await Movie.updateOne(
      {_id: movie._id},
      {$inc: {numberInStock: -1}},
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json(rental);
  } catch (ex) {
    console.error('Error in creating a rental:', ex.message);

    // Rollback the transaction
    await session?.abortTransaction();

    // Passing ex to error handling middleware
    next(ex);
  } finally {
    session?.endSession();
  }
};

export {getAllRentals, getRentalById, createRental};
