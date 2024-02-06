import logger from '../config/logger.js';

export function handleUncaughtExceptions() {
  // eslint-disable-next-line no-undef
  process.on('uncaughtException', ex => {
    logger.error(ex.message, {ex});
  });
}

export function handleUnhandledRejections() {
  // eslint-disable-next-line no-undef
  process.on('unhandledRejection', ex => {
    logger.error(ex.message, {ex});
  });
}
