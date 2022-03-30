const logger = require("./logger");

logger.info("service started");
logger.info("user logged in {userId}", { userId: "12345" });
