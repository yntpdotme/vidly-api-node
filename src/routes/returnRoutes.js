import express from 'express';

import authentication from '../middleware/authentication.js';
import {createReturns} from '../controllers/returnController.js';

const router = express.Router();

router
	.route('/')
	.post(authentication, createReturns);

export default router;