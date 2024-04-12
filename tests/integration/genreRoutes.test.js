import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app.js';
import {Genre} from '../../src/models/Genre.js';
import {Employee} from '../../src/models/Employee.js';

describe('/api/genres', () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    test('should return all genres', async () => {
      await Genre.insertMany([{name: 'genre1'}, {name: 'genre2'}]);

      const res = await request(app).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    test('should return 404 if invalid id is passed', async () => {
      const res = await request(app).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    test('should return 404 if no genre with the given id exists', async () => {
      const id = new mongoose.Types.ObjectId();

      const res = await request(app).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });

    test('should return a genre if valid id is passed', async () => {
      const genre = await Genre.create({name: 'genre1'});

      const res = await request(app).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });

  describe('POST /', () => {
    let accessToken, name;

    beforeEach(() => {
      accessToken = new Employee().generateAccessToken();
      name = 'genre1';
    });

    const exec = () => {
      return request(app)
        .post('/api/genres/')
        .set('authorization', `bearer ${accessToken}`)
        .send({name});
    };

    test('should return 401 if client is not logged in', async () => {
      accessToken = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 3 characters', async () => {
      name = '12';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save a new genre if it is valid', async () => {
      await exec();
      const genre = await Genre.find({name: 'genre1'});

      expect(genre).not.toBeNull();
    });

    test('should return the new genre if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let genre, accessToken, newName, id;

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'});
      await genre.save();

      accessToken = new Employee().generateAccessToken();
      newName = 'updateName';
      id = genre._id;
    });

    const exec = () => {
      return request(app)
        .put('/api/genres/' + id)
        .set('authorization', `bearer ${accessToken}`)
        .send({name: newName});
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

    test('should return 400 if genre is less than 3 characters', async () => {
      newName = '12';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      newName = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 404 if no genre with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should update genre if it is valid', async () => {
      await exec();
      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    test('should return the updated genre if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /:id', () => {
    let genre, accessToken, id;

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'});
      await genre.save();

      const employee = new Employee({
        name: 'Admin',
        email: 'admin@vidly.com',
        password: 'Vidly@1',
        role: 'Admin',
      });
      await employee.save();

      accessToken = employee.generateAccessToken();
      id = genre._id;
    });

    afterEach(async () => {
      await Employee.deleteMany({});
    });

    const exec = () => {
      return request(app)
        .delete('/api/genres/' + id)
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

    test('should return 404 if no genre with the given id exists', async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    test('should delete genre if it is valid', async () => {
      await exec();
      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });
  });
});
