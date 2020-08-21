const passportJwt = require("passport-jwt");
const catchAsync = require("../utils/catchAsync");
const UserModel = require("./../models/user.model");

const passportJwtInit = new passportJwt.Strategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET
}, catchAsync(async (jwt_payload, done) => {
    const user = await UserModel.findOne({_id: jwt_payload.sub._id});

    if (!user) {
        return done(true, false);
    }

    return done(false, user);

}));

module.exports = passportJwtInit;
