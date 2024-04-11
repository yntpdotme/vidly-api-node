import developmentLogger from './developmentLogger.js';
import productionLogger from './productionLogger.js';
import testingLogger from './testingLogger.js';

let logger = null;

switch (process.env.NODE_ENV) {
  case 'production':
    logger = productionLogger();
    break;
  
  case 'test':
    logger = testingLogger();
    break;
  
  default:
    logger = developmentLogger();
}

export default logger;
