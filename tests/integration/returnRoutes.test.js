import request from 'supertest';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

import {Rental} from '../../src/models/Rental.js';
import app from '../../src/app.js';
import {Employee} from '../../src/models/Employee.js';
import {Movie} from '../../src/models/Movie.js';

describe('/api/renturs', () => {
  let customerId, movieId, rental, accessToken;

  beforeEach(() => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'custmer1',
        phone: '+912932083944',
      },
      movie: {
        _id: movieId,
        title: 'movie1',
        dailyRentalRate: 5,
      },
    });
    rental.save();

    accessToken = new Employee().generateAccessToken();
  });

  const exec = () => {
    return request(app)
      .post('/api/returns')
      .set('authorization', `bearer ${accessToken}`)
      .send({customerId, movieId});
  };

  afterEach(async () => {
    await Rental.collection.deleteMany({});
  });

  test('should return 401 if client is not logged in', async () => {
    accessToken = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  test('should return 400 if customerId is not privided', async () => {
    customerId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  test('should return 400 if movieId is not privided', async () => {
    movieId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  test('should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  test('should return 400 if rental already processed', async () => {
    const newRental = new Rental(rental);
    newRental._id = new mongoose.Types.ObjectId();
    newRental.dateReturned = new Date();
    await newRental.save();
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  test('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  test('should set the returnDate if input is valid', async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;

    expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000);
  });

  test('should set the rentalFee if input is valid', async () => {
    const newRental = new Rental(rental);
    newRental._id = new mongoose.Types.ObjectId();
    newRental.dateOut = dayjs().subtract(7, 'days');
    await newRental.save();
    const res = await exec();
    expect(res.status).toBe(200);
  });

  test('should increase the movie stock if input is valid', async () => {
    const movie = new Movie({
      _id: movieId,
      title: 'movie1',
      genre: {
        _id: new mongoose.Types.ObjectId(),
        name: 'genre1',
      },
      numberInStock: 10,
      dailyRentalRate: 5,
    });
    await movie.save();
    await exec();

    const movieInDb = await Movie.findById(movieId);
    await Movie.deleteMany({});

    expect(movieInDb?.numberInStock).toBe(movie.numberInStock + 1);
  });

  test('should return rental if input is valid', async () => {
    const res = await exec();

    const array = ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'];
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(array));
  });
});
