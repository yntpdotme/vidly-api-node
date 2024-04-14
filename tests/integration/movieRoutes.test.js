import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app.js';
import {Movie} from '../../src/models/Movie.js';
import {Employee} from '../../src/models/Employee.js';
import {Genre} from '../../src/models/Genre.js';

describe('/api/movies', () => {
  afterEach(async () => {
    await Movie.deleteMany({});
  });

  describe('GET /', () => {
    test('should return all movies', async () => {
      await Movie.insertMany([
        {
          title: 'movie1',
          dailyRentalRate: 10,
          numberInStock: 10,
          genre: {name: 'genre1', _id: new mongoose.Types.ObjectId()},
        },
        {
          title: 'movie2',
          dailyRentalRate: 20,
          numberInStock: 20,
          genre: {name: 'genre2', _id: new mongoose.Types.ObjectId()},
        },
      ]);

      const res = await request(app).get('/api/movies');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(m => m.title === 'movie1')).toBeTruthy();
      expect(res.body.some(m => m.title === 'movie2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    test('should return 404 if invalid id is passed', async () => {
      const res = await request(app).get('/api/movies/1');

      expect(res.status).toBe(404);
    });

    test('should return 404 if no movie with the given id exists', async () => {
      const id = new mongoose.Types.ObjectId();

      const res = await request(app).get('/api/movies/' + id);

      expect(res.status).toBe(404);
    });

    test('should return a movie if valid id is passed', async () => {
      const movie = await Movie.create({
        title: 'movie1',
        dailyRentalRate: 10,
        numberInStock: 10,
        genre: {name: 'genre1', _id: new mongoose.Types.ObjectId()},
      });

      const res = await request(app).get('/api/movies/' + movie._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', movie.title);
    });
  });

  describe('POST /', () => {
    let genre, accessToken, title;

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'});
      await genre.save();

      accessToken = new Employee().generateAccessToken();
      title = 'movie1';
    });

    afterEach(async () => {
      await Genre.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .post('/api/movies/')
        .set('authorization', `bearer ${accessToken}`)
        .send({
          title,
          dailyRentalRate: 10,
          numberInStock: 10,
          genreId: genre._id,
        });
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if movie is less than 3 characters', async () => {
      title = '12';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if movie is more than 255 characters', async () => {
      title = new Array(257).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is invalid', async () => {
      genre._id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save a new movie if it is valid', async () => {
      await exec();
      const movie = await Movie.find({title: 'movie1'});

      expect(movie).not.toBeNull();
    });

    test('should return the new movie if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'movie1');
    });
  });

  describe('PUT /:id', () => {
    let genre, movie, accessToken, newTitle, id;

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'});
      await genre.save();

      movie = new Movie({
        title: 'movie1',
        dailyRentalRate: 10,
        numberInStock: 10,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      });
      await movie.save();

      accessToken = new Employee().generateAccessToken();
      newTitle = 'updatedTitle';
      id = movie._id;
    });

    afterEach(async () => {
      await Genre.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .put('/api/movies/' + id)
        .set('authorization', `bearer ${accessToken}`)
        .send({
          title: newTitle,
          dailyRentalRate: 10,
          numberInStock: 10,
          genreId: genre._id,
        });
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 404 if invalid id is passed', async () => {
      id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 400 if movie is less than 3 characters', async () => {
      newTitle = '12';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if movie is more than 255 characters', async () => {
      newTitle = new Array(257).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is invalid', async () => {
      genre._id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 404 if no movie with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should update movie if it is valid', async () => {
      await exec();
      const updatedMovie = await Movie.findById(movie._id);

      expect(updatedMovie.title).toBe(newTitle);
    });

    test('should return the updated movie if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', newTitle);
    });
  });

  describe('DELETE /:id', () => {
    let genre, movie, accessToken, id;

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'});
      await genre.save();

      movie = new Movie({
        title: 'movie1',
        dailyRentalRate: 10,
        numberInStock: 10,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      });
      await movie.save();

      const employee = new Employee({
        name: 'Admin',
        email: 'admin@vidly.com',
        password: 'Vidly@1',
        role: 'Admin',
      });
      await employee.save();

      accessToken = employee.generateAccessToken();
      id = movie._id;
    });

    afterEach(async () => {
      await Genre.deleteMany({});
      await Employee.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .delete('/api/movies/' + id)
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
      id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should return 404 if no movie with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should delete movie if it is valid', async () => {
      await exec();
      const movieInDb = await Movie.findById(id);

      expect(movieInDb).toBeNull();
    });
  });
});
