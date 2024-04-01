import express from 'express';

import {registerEmployee} from '../controllers/employeeController.js';

const router = express.Router();

router.route('/signup').post(registerEmployee);

export default router;
