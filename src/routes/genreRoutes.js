import express from 'express';
import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenreById,
  deleteGenreById,
} from '../controllers/genreController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

// TODO: Add authorization for DELETE

router
  .route('/')
  .get(getAllGenres)
  .post(authentication, createGenre);

router
  .route('/:id')
  .get(validateObjectId, getGenreById)
  .put(authentication, validateObjectId, updateGenreById)
  .delete(authentication, validateObjectId, deleteGenreById);

export default router;
