import winston from "winston";

const { createLogger, transports, format } = winston;
const { combine, timestamp, json } = format;

const productionLogger = () => {
	return createLogger({
		level: "info",
		format: combine(timestamp(), json()),
		transports: [
			new transports.File({ filename: "./logs/app-error.log", level: "error" }),
			new transports.File({ filename: "./logs/combined.log" }),
			new transports.MongoDB({
				level: "error",
				options: { useUnifiedTopology: true },
				db: process.env.DB_URL,
				collection: "prod_logs",
			}),
		],
	});
};

export default productionLogger;
