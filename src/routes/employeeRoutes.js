import express from 'express';

import {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  refreshAccessToken
} from '../controllers/employeeController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.route('/signup').post(registerEmployee);
router.route('/signin').post(loginEmployee);
router.route('/signout').get(authentication, logoutEmployee);
router.route('/refresh').post(refreshAccessToken);

export default router;
