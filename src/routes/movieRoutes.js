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
import authorization from '../middleware/authorization.js';

const router = epress.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(authentication, createMovie);

router
  .route('/:id')
  .get(validateObjectId, getMovieById)
  .put(authentication, validateObjectId, updateMovieById)
  .delete(authentication, authorization(['Admin']), validateObjectId, deleteMovieById);

export default router;
