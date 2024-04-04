import jwt from 'jsonwebtoken';

import {Employee} from '../models/Employee.js';

export default async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const employee = await Employee.findById(decodedToken?._id).select(
      '-password -refreshToken -__v',
    );
    req.employee = employee;

    next();
  } catch (error) {
    res.status(401).send('Invalid access token');
  }
};
