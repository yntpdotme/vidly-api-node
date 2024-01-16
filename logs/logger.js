import developmentLogger from "./developmentLogger.js";
import productionLogger from "./productionLogger.js";

let logger = null;

if (process.env.NODE_ENV !== "production") {
	logger = developmentLogger();
}

if (process.env.NODE_ENV === "production") {
	logger = productionLogger();
}

export default logger;
