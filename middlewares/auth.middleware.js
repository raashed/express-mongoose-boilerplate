const passport = require("passport");
const oAuthAccessTokenModel = require("./../models/oAuthAccessToken.model");
const oAuthRefreshTokenModel = require("./../models/oAuthRefreshToken.model");
const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/ApiError");
const httpStatus = require("http-status");
const moment = require("moment");

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    console.log({requiredRights});
    if (err || info || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, {
            message: "Session expired. Please login again."
        });
        return reject(error);
    }

    const oAuthTokenDetail = await oAuthAccessTokenModel.findOne({
        _id: req.headers.authorization.split(" ")[1],
        revoked: false,
        expires: {$gte: moment().format()}
    });

    if (oAuthTokenDetail) {
        const oAuthRefreshDetail = await oAuthRefreshTokenModel.findOne({
            accessToken: oAuthTokenDetail._id,
            revoked: false,
            expires: {$gte: moment().format()}
        });

        if (oAuthRefreshDetail) {
            req.user = user;
            req.access = oAuthTokenDetail;
            req.refresh = oAuthRefreshDetail;

            return resolve();
        }
    }

    const error = new ApiError(httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
    return reject(error);
};

const isAuthenticated = (...requiredRights) => catchAsync(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport.authenticate("jwt", {
            session: false
        }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

const clientVerifyCallback = (req, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, {
            message: "Invalid client."
        });
        return reject(error);
    }

    req.client = user;
    return resolve();
};

const isClientAuthenticated = catchAsync(async (req, res, next) => {
    return new Promise((resolve, reject) => {
        return passport.authenticate("basic", clientVerifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});

module.exports = {
    isAuthenticated,
    isClientAuthenticated,
};
