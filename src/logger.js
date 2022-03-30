const winston = require("winston");
const { format } = require("logform");
const { SPLAT } = require("triple-beam");
const config = require("./config");

function injectMetadata(message, splat) {
  for (const key in splat) {
    const value = splat[key];
    message = message.replace(new RegExp(`{${key}}`, "g"), value);
  }
  return message;
}

const interpolateMessage = format((info) => {
  const splat = info[SPLAT];
  if (splat) {
    info.message = injectMetadata(info.message, splat[0]);
  }
  return info;
});

/**
 * prod: json
 * otherwise: "{level}: {message} {metadata}"
 */
const formatter =
  process.env.NODE_ENV === "production"
    ? winston.format.combine(interpolateMessage(), winston.format.json())
    : winston.format.combine(interpolateMessage(), winston.format.simple());

module.exports = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  silent: process.env.NODE_ENV === "test",
  format: formatter,
  transports: [new winston.transports.Console()],
  defaultMeta: {
    service: config.serviceName,
    version: config.version,
  },
});
