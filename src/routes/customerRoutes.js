import express from 'express';
import {
  createCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
} from '../controllers/customerController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

// TODO: Add authorization for DELETE

router
  .route('/')
  .get(authentication, getAllCustomers)
  .post(authentication, createCustomer);

router
  .route('/:id')
  .get(authentication, validateObjectId, getCustomerById)
  .put(authentication, validateObjectId, updateCustomerById)
  .delete(authentication, validateObjectId, deleteCustomerById);

export default router;
