import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app.js';
import {Customer} from '../../src/models/Customer.js';
import {Employee} from '../../src/models/Employee.js';

describe('/api/customers', () => {
  afterEach(async () => {
    await Customer.deleteMany({});
  });

  describe('GET /', () => {
    test('should return all customers', async () => {
      await Customer.insertMany([
        {name: 'customer1', phone: '+919183049823'},
        {name: 'customer2', phone: '+919883049823'},
      ]);

      const accessToken = new Employee().generateAccessToken();
      const res = await request(app)
        .get('/api/customers')
        .set('authorization', `bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(c => c.name === 'customer1')).toBeTruthy();
      expect(res.body.some(c => c.name === 'customer2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let accessToken, id;

    beforeEach(() => {
      accessToken = new Employee().generateAccessToken();
    });

    const exec = () => {
      return request(app)
        .get('/api/customers/' + id)
        .set('authorization', `bearer ${accessToken}`);
    };

    test('should return 404 if invalid id is passed', async () => {
      id = '1';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 404 if no customer with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return a customer if valid id is passed', async () => {
      const customer = await Customer.create({
        name: 'customer1',
        phone: '+919183049823',
			});
			id = customer._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', customer.name);
    });
  });

  describe('POST /', () => {
    let accessToken, name;

    beforeEach(() => {
      accessToken = new Employee().generateAccessToken();
      name = 'customer1';
    });

    const exec = () => {
      return request(app)
        .post('/api/customers/')
        .set('authorization', `bearer ${accessToken}`)
        .send({name: name, phone: '+919183049823'});
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if customer is less than 2 characters', async () => {
      name = '1';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if customer is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save a new customer if it is valid', async () => {
      await exec();
      const customer = await Customer.find({name: 'customer1'});

      expect(customer).not.toBeNull();
    });

    test('should return the new customer if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'customer1');
    });
  });

  describe('PUT /:id', () => {
    let customer, accessToken, newName, id;

    beforeEach(async () => {
      customer = new Customer({name: 'customer1', phone: '+919183049823'});
      await customer.save();

      accessToken = new Employee().generateAccessToken();
      newName = 'updateName';
      id = customer._id;
    });

    const exec = () => {
      return request(app)
        .put('/api/customers/' + id)
        .set('authorization', `bearer ${accessToken}`)
        .send({name: newName, phone: '+919183049823'});
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 404 if invalid id is passed', async () => {
      id = '1';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 400 if customer is less than 2 characters', async () => {
      newName = '1';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if customer is more than 50 characters', async () => {
      newName = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 404 if no customer with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should update customer if it is valid', async () => {
      await exec();
      const updatedCustomer = await Customer.findById(customer._id);

      expect(updatedCustomer.name).toBe(newName);
    });

    test('should return the updated customer if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /:id', () => {
    let customer, accessToken, id;

    beforeEach(async () => {
      customer = new Customer({name: 'customer1', phone: '+919183049823'});
      await customer.save();

      const employee = new Employee({
        name: 'Admin',
        email: 'admin@vidly.com',
        password: 'Vidly@1',
        role: 'Admin',
      });
      await employee.save();

      accessToken = employee.generateAccessToken();
      id = customer._id;
    });

    afterEach(async () => {
      await Employee.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .delete('/api/customers/' + id)
        .set('authorization', `bearer ${accessToken}`);
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 403 if the user is not an admin', async () => {
      const employee = new Employee({
        name: 'Employee',
        email: 'employee@vidly.com',
        password: 'Vidly@1',
      });
      await employee.save();

      accessToken = employee.generateAccessToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    test('should return 404 if invalid id is passed', async () => {
      id = '1';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 404 if no customer with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should delete customer if it is valid', async () => {
      await exec();
      const customerInDb = await Customer.findById(id);

      expect(customerInDb).toBeNull();
    });
  });
});
