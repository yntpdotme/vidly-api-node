import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app.js';
import {Employee} from '../../src/models/Employee.js';

describe('/api/employees', () => {
  afterEach(async () => {
    await Employee.deleteMany({});
  });

  describe('POST /signup', () => {
    test('should register a new employee', async () => {
      const res = await request(app).post('/api/employees/signup').send({
        name: 'Employee',
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('employee');
      expect(res.body.employee).toHaveProperty('_id');
      expect(res.body.employee).toHaveProperty('name', 'Employee');
      expect(res.body.employee).toHaveProperty('email', 'employee@vidly.com');
      expect(res.body.employee).toHaveProperty('role', 'Employee');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    // Add more tests for other scenarios (e.g., invalid data, existing email, etc.)
  });

  describe('POST /signin', () => {
    beforeEach(async () => {
      const employee = new Employee({
        name: 'Employee',
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });
      await employee.save();
    });

    test('should sign in an existing employee', async () => {
      const res = await request(app).post('/api/employees/signin').send({
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('employee');
      expect(res.body.employee).toHaveProperty('_id');
      expect(res.body.employee).toHaveProperty('name', 'Employee');
      expect(res.body.employee).toHaveProperty('email', 'employee@vidly.com');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    test('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/employees/signin').send({
        password: 'Vidly@1',
      });

      expect(res.status).toBe(400);
    });

    test('should return 400 if password is missing', async () => {
      const res = await request(app).post('/api/employees/signin').send({
        email: 'employee@vidly.com',
      });

      expect(res.status).toBe(400);
    });

    test('should return 401 if email or password is incorrect', async () => {
      const res = await request(app).post('/api/employees/signin').send({
        email: 'employee@vidly.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /signout', () => {
    test('should sign out an employee', async () => {
      const employee = new Employee({
        name: 'Employee',
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });
      await employee.save();

      const agent = request.agent(app);
      await agent.post('/api/employees/signin').send({
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });

      const res = await agent.get('/api/employees/signout');

      expect(res.status).toBe(200);
      expect(res.text).toBe('"Employee logged out"');
    });
  });

  describe('POST /refresh', () => {
    test('should refresh access token', async () => {
      const employee = new Employee({
        name: 'Employee',
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });
      (employee.refreshToken = employee.generateRefreshToken()),
        await employee.save();

      const res = await request(app)
        .post('/api/employees/refresh')
        .send({refreshToken: employee.refreshToken});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    test('should return 401 if refresh token is missing', async () => {
      const res = await request(app).post('/api/employees/refresh');

      expect(res.status).toBe(401);
    });
  });
});
