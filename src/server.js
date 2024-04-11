import app from './app.js';
import logger from './logger/logger.js';

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Listening on Port ${port}...`));