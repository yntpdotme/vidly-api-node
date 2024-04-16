import 'dotenv/config';
import jwt from 'jsonwebtoken';

import {Employee} from '../../src/models/Employee.js';

// Mock employee data for testing
const employeeData = {
  name: 'Employee',
  email: 'employee@vidly.com',
  password: 'Vidly@1',
};

describe('Employee Model', () => {
  test('should generate an access token', () => {
    const employee = new Employee(employeeData);
    const accessToken = employee.generateAccessToken();

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    expect(decoded._id).toBe(employee._id.toString());
    expect(decoded.email).toBe(employee.email);
  });

  test('should generate a refresh token', () => {
    const employee = new Employee(employeeData);
    const refreshToken = employee.generateRefreshToken();

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    expect(decoded._id).toBe(employee._id.toString());
  });
});
