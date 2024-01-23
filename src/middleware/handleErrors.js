import logger from "../config/logger.js";

export function handleUncaughtExceptions() {
	process.on("uncaughtException", (ex) => {
		logger.error(ex.message, { ex });
	});
}

export function handleUnhandledRejections() {
	process.on("unhandledRejection", (ex) => {
		logger.error(ex.message, { ex });
	});
}
