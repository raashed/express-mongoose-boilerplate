const morgan = require("morgan");

const m = process.env.NODE_ENVIRONMENT === "production"
    ? morgan(":method :url :status")
    : morgan(":method :url :status :res[content-length] - :response-time ms");

module.exports = m;
