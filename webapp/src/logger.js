const winston = require("winston")
const { format } = require("logform")
const { SPLAT } = require("triple-beam")
const { ElasticsearchTransport } = require("winston-elasticsearch")
const config = require("./config")

function injectMetadata(message, splat) {
  for (const key in splat) {
    const value = splat[key]
    message = message.replace(new RegExp(`{${key}}`, "g"), value)
  }
  return message
}

const addTimestamp = format((info) => {
  info.timestamp = Date.now()
  return info
})

const interpolateMessage = format((info) => {
  const splat = info[SPLAT]
  if (splat) {
    info.message = injectMetadata(info.message, splat[0])
  }
  return info
})

/**
 * prod: json
 * otherwise: "{level}: {message} {metadata}"
 */
const formatter =
  process.env.NODE_ENV === "production"
    ? winston.format.combine(
        addTimestamp(),
        interpolateMessage(),
        winston.format.json()
      )
    : winston.format.combine(
        addTimestamp(),
        interpolateMessage(),
        winston.format.simple()
      )

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  silent: process.env.NODE_ENV === "test",
  format: formatter,
  transports: [new winston.transports.Console()],
  defaultMeta: {
    service: config.serviceName,
    version: config.version,
  },
})

if (config.elasticsearch.url) {
  logger.add(
    new ElasticsearchTransport({
      level: "info",
      index: `${config.serviceName}-service-logs`,
      clientOpts: {
        node: {
          url: new URL(config.elasticsearch.url),
        },
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      },
    })
  )
}

module.exports = logger
