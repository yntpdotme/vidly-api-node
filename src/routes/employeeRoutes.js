import express from 'express';

import {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
} from '../controllers/employeeController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.route('/signup').post(registerEmployee);
router.route('/signin').post(loginEmployee);
router.route('/signout').get(authentication, logoutEmployee);

export default router;
