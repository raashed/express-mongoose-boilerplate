const expressSlowDowner = require("express-slow-down");

const expressSlowDown = expressSlowDowner({
    windowMs: process.env.WINDOW_BLOCK_SECOND * 1000,
    delayAfter: process.env.PER_WINDOW_MAX_REQUEST,
    delayMs: 500,
});

module.exports = expressSlowDown;
