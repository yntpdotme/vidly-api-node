import logger from "../logs/logger.js";

export function handleUncaughtExceptions() {
	process.on("uncaughtException", (ex) => {
		logger.error(ex.message, { ex });
	});

	// process.on("uncaughtException", (ex) => {
	// 	logger.error("Uncaught Exception:", ex);
	// 	// Ensure a clean exit after handling the uncaught exception
	// 	process.exit(1);
	// });
}

export function handleUnhandledRejections() {
	process.on("unhandledRejection", (ex) => {
		logger.error(ex.message, { ex });
	});
}
