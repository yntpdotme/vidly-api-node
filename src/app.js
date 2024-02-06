import express from 'express';

import routes from './startup/routes.js';
import db from './startup/db.js';
import {handleUncaughtExceptions, handleUnhandledRejections} from './middleware/handleErrors.js';

handleUncaughtExceptions();
handleUnhandledRejections();

const app = express();

routes(app);
db();

export default app;
