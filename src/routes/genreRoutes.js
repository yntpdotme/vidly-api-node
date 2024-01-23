// routes/genreRoutes.js
import express from "express";
import {
	getAllGenres,
	getGenreById,
	createGenre,
	updateGenreById,
	deleteGenreById,
} from "../controllers/genreController.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// TODO: Add authentication for POST, PUT, DELETE
// TODO: Add authorization for DELETE

router
  .route("/")
  .get(getAllGenres)
  .post(createGenre);

router
  .route("/:id")
  .get(validateObjectId, getGenreById)
  .put(validateObjectId, updateGenreById)
  .delete(validateObjectId, deleteGenreById);

export default router;
