const winston = require("winston");
const config = require("./config");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
  defaultMeta: {
    service: config.serviceName,
    version: config.version,
  },
});

module.exports = logger;
