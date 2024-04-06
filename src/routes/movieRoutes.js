import epress from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} from '../controllers/movieController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authentication from '../middleware/authentication.js';

const router = epress.Router();

// TODO: Add authorization for DELETE

router
  .route('/')
  .get(getAllMovies)
  .post(authentication, createMovie);

router
  .route('/:id')
  .get(validateObjectId, getMovieById)
  .put(authentication, validateObjectId, updateMovieById)
  .delete(authentication, validateObjectId, deleteMovieById);

export default router;
