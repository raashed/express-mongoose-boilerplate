const passportHttp = require("passport-http");
const catchAsync = require("../utils/catchAsync");
const oAuthClientModel = require("./../models/oAuthClient.model");

const passportHttpInit = new passportHttp.BasicStrategy("Users", catchAsync(async (name, secret, done) => {
    const client = await oAuthClientModel.findOne({name, secret});

    if (!client) {
        const error = new Error("client not found");
        error.name = "Unauthorized";
        return done(error, client);
    }

    if (client.revoked) {
        const error = new Error("client revoked");
        error.name = "InvalidClient";
        return done(error, client);
    }

    return done(null, client);
}))

module.exports = passportHttpInit;
