import developmentLogger from './developmentLogger.js';
import productionLogger from './productionLogger.js';
import testingLogger from './testingLogger.js';
import vercelLogger from './vercelLogger.js';

let logger = null;

switch (process.env.NODE_ENV) {
  case 'production':
    // logger = productionLogger();
    logger = vercelLogger();
    break;
  
  case 'test':
    logger = testingLogger();
    break;
  
  default:
    logger = developmentLogger();
}

export default logger;
