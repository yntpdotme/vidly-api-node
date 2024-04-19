import mongoose from 'mongoose';

import {Rental, validate} from '../models/Rental.js';
import {Movie} from '../models/Movie.js';

const createReturns = async (req, res, next) => {
  let session;

  try {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.issues[0].message);

    // Starting Session
    session = await mongoose.startSession();
    session.startTransaction();

    // Validating Rental
    const rental = await Rental.lookup(
      req.body.customerId,
      req.body.movieId,
    ).session(session);

    if (!rental) return res.status(404).send('Rental not found.');
    if (rental.dateReturned)
      return res.status(400).send('Rental alredy processed.');

    // Process the rental
    rental.return({session});
    await rental.save({session});

    await Movie.updateOne(
      {_id: rental.movie._id},
      {$inc: {numberInStock: 1}},
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json(rental);
  } catch (ex) {
    console.error('Error in creating a rental:', ex);

    // Rollback the transaction
    await session?.abortTransaction();

    // Passing ex to error handling middleware
    next(ex);
  } finally {
    session?.endSession();
  }
};

export {createReturns};
