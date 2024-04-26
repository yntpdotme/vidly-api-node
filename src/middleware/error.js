import logger from '../logger/logger.js';

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  logger.error(err.message, {err});
  res.status(500).json(err?.message || 'Something failed');
};
