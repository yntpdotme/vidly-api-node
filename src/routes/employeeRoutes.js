import express from 'express';

import {
  registerEmployee,
  loginEmployee,
} from '../controllers/employeeController.js';

const router = express.Router();

router.route('/signup').post(registerEmployee);
router.route('/signin').post(loginEmployee);

export default router;
