import app from "./index.js";
import logger from "./logs/logger.js";


const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Listening on Port ${port}...`));
