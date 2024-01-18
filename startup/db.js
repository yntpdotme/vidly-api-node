import mongoose from "mongoose";
import "dotenv/config";
import logger from "../logs/logger.js";

const db = () => {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => logger.info(`Connected to MongoDB...`))
		.catch((ex) => logger.error(ex));
};

export default db;