import express from 'express';

import genresRoutes from '../routes/genreRoutes.js';
import customersRoutes from '../routes/customerRoutes.js';
import error from '../middleware/error.js';

const routes = app => {
  app.use(express.json());
  app.use('/api/genres', genresRoutes);
  app.use('/api/customers', customersRoutes);
  app.use(error);
};

export default routes;
