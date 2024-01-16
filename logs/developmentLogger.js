import winston from "winston";
import "winston-mongodb";
import "dotenv/config";

const { createLogger, transports, format } = winston;
const { combine, cli, timestamp, json } = format;

const developmentLogger = () => {
	return createLogger({
		level: "info",
		transports: [
			new transports.Console({
				format: cli(),
			}),
			new transports.MongoDB({
				format: combine(timestamp(), json()),
				options: { useUnifiedTopology: true },
				db: process.env.DB_URL,
				collection: "dev_logs",
			}),
		],
	});
};

export default developmentLogger;
