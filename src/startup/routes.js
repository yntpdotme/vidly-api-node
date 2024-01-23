import express from "express";

import genresRoutes from "../routes/genreRoutes.js";
import error from "../middleware/error.js";

const routes = (app) => {
	app.use(express.json());
	app.use("/api/genres", genresRoutes);
	app.use(error);
};

export default routes;
