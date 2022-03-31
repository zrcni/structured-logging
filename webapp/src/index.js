const logger = require("./logger")

logger.info("service started")
logger.info("user logged in {userId}", { userId: "12345" })
logger.info("user logged in {userId}", { userId: "56789" })
logger.info("user logged in {userId}", { userId: "34567" })

logger.info("user logged out {userId}", { userId: "12345" })
logger.info("user logged out {userId}", { userId: "56789" })
logger.info("user logged out {userId}", { userId: "34567" })
logger.info("service stopped")
