import logger from "../config/logger.js";

export default (err, req, res, next) => {
	logger.error(err.message, {err});
	res.status(500).send("Something failed");
};
