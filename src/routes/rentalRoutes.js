import express from 'express';

import {
  createRental,
  getAllRentals,
  getRentalById,
} from '../controllers/rentalController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router
  .route('/')
  .get(authentication, getAllRentals)
  .post(authentication, createRental);

router
  .route('/:id')
  .get(authentication, validateObjectId, getRentalById);

export default router;
