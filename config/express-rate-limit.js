const expressRateLimiter = require("express-rate-limit");

const expressRateLimit = expressRateLimiter({
    windowMs: process.env.WINDOW_BLOCK_SECOND * 1000,
    max: process.env.PER_WINDOW_MAX_REQUEST,
    message: `You have exceeded the ${process.env.PER_WINDOW_MAX_REQUEST} requests in ${process.env.WINDOW_BLOCK_SECOND} seconds limit!`,
});

module.exports = expressRateLimit;
