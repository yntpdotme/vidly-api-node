import app from './app.js';
import logger from './config/logger.js';

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Listening on Port ${port}...`));
