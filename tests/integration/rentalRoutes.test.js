import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app.js';
import {Rental} from '../../src/models/Rental.js';
import {Customer} from '../../src/models/Customer.js';
import {Movie} from '../../src/models/Movie.js';
import {Employee} from '../../src/models/Employee.js';

describe('/api/rentals', () => {
  afterEach(async () => {
    await Rental.deleteMany({});
  });

  describe('GET /', () => {
    test('should return all rentals', async () => {
      await Rental.insertMany([
        {
          customer: {
            _id: new mongoose.Types.ObjectId(),
            name: 'customer1',
            phone: '+913324784283',
          },
          movie: {
            _id: new mongoose.Types.ObjectId(),
            title: 'movie1',
            dailyRentalRate: 10,
          },
        },
        {
          customer: {
            _id: new mongoose.Types.ObjectId(),
            name: 'customer2',
            phone: '+919324784283',
          },
          movie: {
            _id: new mongoose.Types.ObjectId(),
            title: 'movie2',
            dailyRentalRate: 15,
          },
        },
      ]);

      const accessToken = new Employee().generateAccessToken();
      const res = await request(app)
        .get('/api/rentals')
        .set('authorization', `bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(r => r.customer.name === 'customer1')).toBeTruthy();
      expect(res.body.some(r => r.movie.title === 'movie2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let accessToken, id;

    beforeEach(() => {
      accessToken = new Employee().generateAccessToken();
    });

    const exec = () => {
      return request(app)
        .get('/api/rentals/' + id)
        .set('authorization', `bearer ${accessToken}`);
    };

    test('should return 404 if invalid id is passed', async () => {
      id = '1';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 404 if no rental with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return a rental if valid id is passed', async () => {
      const rental = await Rental.create({
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'customer2',
          phone: '+919324784283',
        },
        movie: {
          _id: new mongoose.Types.ObjectId(),
          title: 'movie2',
          dailyRentalRate: 15,
        },
      });
      id = rental._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('customer.name', rental.customer.name);
    });
  });

  describe('POST /', () => {
    let customer, movie, customerId, movieId, accessToken;

    beforeEach(async () => {
      customer = new Customer({name: 'customer1', phone: '+919183049823'});
      await customer.save();

      movie = new Movie({
        title: 'movie1',
        dailyRentalRate: 10,
        numberInStock: 10,
        genre: {name: 'genre1', _id: new mongoose.Types.ObjectId()},
      });
      await movie.save();

      accessToken = new Employee().generateAccessToken();
    });

    afterEach(async () => {
      await Customer.deleteMany({});
      await Movie.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .post('/api/rentals/')
        .set('authorization', `bearer ${accessToken}`)
        .send({customerId: customer._id, movieId: movie._id});
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if customer is invalid', async () => {
      customer._id = 1;
      const res = await request(app)
        .post('/api/rentals/')
        .set('authorization', `bearer ${accessToken}`)
        .send({customerId: 1, movieId: movie._id});

      expect(res.status).toBe(400);
    });

    test('should return 400 if movie is invalid', async () => {
      movie._id = 1;
      const res = await request(app)
        .post('/api/rentals/')
        .set('authorization', `bearer ${accessToken}`)
        .send({customerId: customer._id, movieId: 1});

      expect(res.status).toBe(400);
    });

    test('should return 400 if no customer with the given id exists', async () => {
      customer._id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if no movie with the given id exists', async () => {
      movie._id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if movie is not in stock invalid', async () => {
      let newMovie = new Movie({
        title: 'movie2',
        dailyRentalRate: 10,
        numberInStock: 0,
        genre: {name: 'genre1', _id: new mongoose.Types.ObjectId()},
      });
      await newMovie.save();
      movie._id = newMovie._id;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save a new rental if it is valid', async () => {
      await exec();
      const rental = await Rental.find({'customer.name': 'customer1'});

      expect(rental).not.toBeNull();
    });

    test('should return the new rental if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer.name', 'customer1');
    });
  });
});
