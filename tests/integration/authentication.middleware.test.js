import request from 'supertest';

import app from '../../src/app.js';
import {Employee} from '../../src/models/Employee.js';
import {Genre} from '../../src/models/Genre.js';

describe('authentication middleware', () => {
  let accessToken;

  const exec = () => {
    return request(app)
      .post('/api/genres')
      .set('authorization', `bearer ${accessToken}`)
      .send({name: 'genre1'});
  };

  beforeEach(() => {
    accessToken = new Employee().generateAccessToken();
  });

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  test('should return 401 if no accessToken is provided', async () => {
    accessToken = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  test('should return 401 if invalid accessToken is provided', async () => {
    accessToken = 'abcd';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  test('should return 201 if valid accessToken is provided', async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });
});
