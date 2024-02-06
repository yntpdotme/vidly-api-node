import developmentLogger from './developmentLogger.js';
import productionLogger from './productionLogger.js';

let logger = null;

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  logger = developmentLogger();
}

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'production') {
  logger = productionLogger();
}

export default logger;
