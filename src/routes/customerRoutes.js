import express from 'express';
import {
  createCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
} from '../controllers/customerController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router
	.route('/')
	.get(getAllCustomers)
	.post(createCustomer);
	
router
  .route('/:id')
  .get(validateObjectId, getCustomerById)
  .put(validateObjectId, updateCustomerById)
  .delete(validateObjectId, deleteCustomerById);

export default router;
