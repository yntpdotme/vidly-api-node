import mongoose from 'mongoose';
import 'dotenv/config';
import logger from '../config/logger.js';

// Load environment variables based on NODE_ENV

// eslint-disable-next-line no-undef
const environment = process.env.NODE_ENV || 'development';
// eslint-disable-next-line no-undef
const url = environment === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

const db = () => {
  mongoose
    .connect(url)
    .then(() => logger.info(`Connected to MongoDB...`))
    .catch(ex => logger.error(ex));
};

export default db;
