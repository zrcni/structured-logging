module.exports = {
  serviceName: "webapp",
  version: process.env.COMMIT_SHA || "dev",
  elasticsearch: {
    url: "http://localhost:9200",
    username: "elastic",
    password: "changeme",
  },
}
