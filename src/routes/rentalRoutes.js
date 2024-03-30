import express from 'express';

import {
  createRental,
  getAllRentals,
  getRentalById,
} from '../controllers/rentalController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').get(getAllRentals).post(createRental);

router.route('/:id').get(validateObjectId, getRentalById);

export default router;
