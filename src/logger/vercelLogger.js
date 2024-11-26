import winston from 'winston';
import 'winston-mongodb';

const {createLogger, transports, format} = winston;
const {combine, cli, timestamp, json, metadata} = format;

const vercelLogger = () => {
  return createLogger({
    level: 'info',
    transports: [
      new transports.Console({
        format: cli(),
      }),
      new transports.MongoDB({
        level: 'error',
        options: {useUnifiedTopology: true},
        db: process.env.DB_URL,
        collection: 'logs_prod',
      }),
    ],
    exceptionHandlers: [
      new transports.Console({
        format: cli(),
      }),
    ],
    rejectionHandlers: [
      new transports.Console({
        format: cli(),
      }),
    ],
  });
};

export default vercelLogger;
