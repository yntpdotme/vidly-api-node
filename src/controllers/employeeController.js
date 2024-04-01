import jwt from 'jsonwebtoken';
import 'dotenv/config';

import {Employee, ValidateLogin, ValidateRegister} from '../models/Employee.js';

const generateAccessAndRefreshTokens = async employeeId => {
  try {
    const employee = await Employee.findById(employeeId);

    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    // attach refresh token to employee document to avoid refreshing access token with multiple refresh tokens
    employee.refreshToken = refreshToken;
    await employee.save();

    return {accessToken, refreshToken};
  } catch (error) {
    res
      .status(500)
      .send('Something went wrong while generating the access token');
  }
};

const registerEmployee = async (req, res) => {
  const {error} = ValidateRegister(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  let employee = await Employee.findOne({email: req.body.email});
  if (employee)
    return res.status(409).send('Employee with email already exists');

  employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await employee.save();

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(
    employee._id,
  );

  const options = {
    httpOnly: true,
    sercure: process.env.NODE_ENV === 'production',
  };

  const {_id, name, email} = employee;
  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({employee: {_id, name, email}, accessToken, refreshToken});
};

export {registerEmployee};
