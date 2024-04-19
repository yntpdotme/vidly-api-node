import express from 'express';
import cookieParser from 'cookie-parser';

import genresRoutes from '../routes/genreRoutes.js';
import customersRoutes from '../routes/customerRoutes.js';
import moviesRoutes from '../routes/movieRoutes.js';
import rentalRoutes from '../routes/rentalRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import returnRoutes from '../routes/returnRoutes.js';
import error from '../middleware/error.js';

export default app => {
  app.use(express.json({limit: '16kb'}));
  app.use(cookieParser());
  app.use('/api/genres', genresRoutes);
  app.use('/api/customers', customersRoutes);
  app.use('/api/movies', moviesRoutes);
  app.use('/api/rentals', rentalRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/returns', returnRoutes);
  app.use(error);
};
