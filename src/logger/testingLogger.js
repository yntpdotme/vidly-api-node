import winston from 'winston';

const {createLogger, transports, format} = winston;
const {cli, json,} = format;

const testingLogger = () => {
  return createLogger({
    level: 'info',
    transports: [
      new transports.Console({
        format: cli(),
      }),
    ],
    exceptionHandlers: [
      new transports.File({
        filename: 'logs/uncaughtException.log',
        format: json(),
      }),
    ],
    rejectionHandlers: [
      new transports.File({
        filename: 'logs/unhandledRejection.log',
        format: json(),
      }),
    ],
  });
};

export default testingLogger;
