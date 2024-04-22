import express from 'express';
import 'dotenv/config';

import prodMiddlewares from './startup/prod.js';
import routes from './startup/routes.js';
import connetDB from './startup/db.js';
import {handleUncaughtExceptions, handleUnhandledRejections} from './middleware/handleErrors.js';

handleUncaughtExceptions();
handleUnhandledRejections();

const app = express();

prodMiddlewares(app);
routes(app);
connetDB();

export default app;
