require("dotenv").config();

const express = require("express");
const morgan = require("./config/morgan");
const helmet = require("helmet");
const cors = require("./config/cors");
const passport = require("passport");
const expressRateLimit = require("./config/express-rate-limit");
const expressSlowDown = require("./config/express-slow-down");
const passportJwt = require("./config/passport-jwt");
const passportHttp = require("./config/passport-http");
const {swaggerServe, swaggerSetup} = require("./config/swagger");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const seeds = require("./seeds");

const routes = require("./routes");

const app = express();

require("./config/mongoose"); // connect mongoose

app.use("/api-docs", swaggerServe, swaggerSetup); // swagger api documentations
app.use(morgan); // HTTP request logger
app.use(helmet()); // set security HTTP headers
app.use(express.json()); // parse json request body
app.use(xssClean()); // sanitize request data
app.use(mongoSanitize()); // sanitize mongoose data
app.use(compression()); // gzip compression
app.use(cors); // enable cors
// only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
app.enable("trust proxy");

app.use(passport.initialize()); // passport authentication initialize
passport.use("jwt", passportJwt); // passport jwt authentication initialize
passport.use("basic", passportHttp); // passport http authentication initialize

if (process.env.NODE_ENVIRONMENT === "production") {
    app.use(expressRateLimit); // per window rate limit
    app.use(expressSlowDown);  // slows down responses rather than blocking
}

seeds(false); // seeds

app.use(routes); // routes

module.exports = app;
