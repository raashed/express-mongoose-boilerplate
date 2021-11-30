require("dotenv").config();
require("../config/mongoose");

const seeds = require("./index");
seeds(true);
