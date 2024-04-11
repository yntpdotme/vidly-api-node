import express from 'express';
import 'dotenv/config';

import routes from './startup/routes.js';
import connetDB from './startup/db.js';
import {handleUncaughtExceptions, handleUnhandledRejections} from './middleware/handleErrors.js';

handleUncaughtExceptions();
handleUnhandledRejections();

const app = express();

routes(app);
connetDB();

export default app;
