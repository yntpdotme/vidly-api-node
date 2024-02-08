import epress from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} from '../controllers/movieController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = epress.Router();

// TODO: Add authentication for POST, PUT, DELETE
// TODO: Add authorization for DELETE

router
  .route('/')
  .get(getAllMovies)
  .post(createMovie);

router
  .route('/:id')
  .get(validateObjectId, getMovieById)
  .put(validateObjectId, updateMovieById)
  .delete(validateObjectId, deleteMovieById);

export default router;
