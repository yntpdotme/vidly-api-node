import cookieParser from 'cookie-parser';
import express from 'express';

import error from '../middleware/error.js';
import customersRoutes from '../routes/customerRoutes.js';
import employeeRoutes from '../routes/employeeRoutes.js';
import genresRoutes from '../routes/genreRoutes.js';
import moviesRoutes from '../routes/movieRoutes.js';
import rentalRoutes from '../routes/rentalRoutes.js';
import returnRoutes from '../routes/returnRoutes.js';

export default app => {
  app.use(express.json({limit: '16kb'}));
  app.use(cookieParser());

  app.use('/', (req, res) => {
    res.send(
      `Welcome to Vidly Server.
      <a href="https://documenter.getpostman.com/view/31850881/2sA3Bj8Zfc" target='_blank'>Explore API Docs</a>`,
    );
  });

  app.use('/api/genres', genresRoutes);
  app.use('/api/customers', customersRoutes);
  app.use('/api/movies', moviesRoutes);
  app.use('/api/rentals', rentalRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/returns', returnRoutes);
  app.use(error);
};
