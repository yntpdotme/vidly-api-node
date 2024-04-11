import mongoose from 'mongoose';
import 'dotenv/config';
import logger from '../logger/logger.js';

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
const url = environment === 'test' ? process.env.DB_URL_TEST : process.env.DB_URL;

export default () => {
  mongoose
    .connect(url)
    .then(() => logger.info(`Connected to MongoDB...`))
    .catch(ex => logger.error(ex));
};
