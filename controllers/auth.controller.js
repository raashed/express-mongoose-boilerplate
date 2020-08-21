const catchAsync = require("../utils/catchAsync");
const UserModel = require("../models/user.model");
const OAuthAccessTokenModel = require("../models/oAuthAccessToken.model");
const OAuthRefreshTokenModel = require("../models/oAuthRefreshToken.model");
const jsonwebtoken = require("jsonwebtoken");
const moment = require("moment");
const apiResponse = require("../utils/apiResponse");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const validationError = require("../utils/validationError");

const generateToken = (user, exp, secret) => {
    return jsonwebtoken.sign({
        sub: user,
        iat: moment().unix(),
        exp: moment(exp).unix(),
    }, secret);
};

const OAuthAccessTokenDetail = async (accessToken, user, permissions, exp) => {
    const data = new OAuthAccessTokenModel({
        _id: accessToken,
        user: user._id,
        scopes: permissions,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};

const OAuthRefreshTokenDetail = async (refreshToken, accessTokenDetail, clientId, exp) => {
    const data = new OAuthRefreshTokenModel({
        _id: refreshToken,
        accessToken: accessTokenDetail._id,
        client: clientId,
        revoked: false,
        expires: exp,
    });
    return await data.save();
};

const accessTokenDetailAndRefreshTokenDetail = async (user, permissions, clientId) => {
    const exp = moment().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES), "minutes");
    const accessToken = await generateToken(user, exp, process.env.JWT_ACCESS_SECRET);
    const exp2 = moment().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS), "days");
    const refreshToken = await generateToken(user, exp2, process.env.JWT_REFRESH_SECRET);

    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, permissions, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken, accessTokenDetail, clientId, exp2);

    return {accessTokenDetail, refreshTokenDetail};
}
const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;

    const user = await UserModel.findOne({
        $or: [{email: email}, {username: email}]
    });

    if (!user) {
        return apiResponse(res, httpStatus.UNAUTHORIZED, {
            message: "Invalid email or username. Please register first."
        });
    } else if (!(await user.isPasswordMatch(password))) {
        return apiResponse(res, httpStatus.UNAUTHORIZED, {
            message: "Password not matched."
        });
    }

    let permissions = [];
    user.roles.forEach(role => {
        permissions = permissions.concat(role.permissions);
    });

    const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, permissions, req.client._id);

    return apiResponse(res, httpStatus.OK, {
        access: {
            token: accessTokenDetail._id,
            expires: accessTokenDetail.expires,
        },
        refresh: {
            token: refreshTokenDetail._id,
            expires: refreshTokenDetail.expires,
        },
        user: user,
        scopes: permissions,
    });
});

const loginUpdate = catchAsync(async (req, res) => {
    const {refresh} = req.body;

    const user = req.user;
    const accessDetail = req.access;
    const refreshDetail = await OAuthRefreshTokenModel.findOne({
        _id: refresh,
        accessToken: accessDetail._id,
        revoked: false,
        expires: {$gte: moment().format()}
    });


    if (refreshDetail) {
        await OAuthAccessTokenModel.findByIdAndUpdate(accessDetail._id, {revoked: true,});

        let permissions = [];
        user.roles.forEach(role => {
            permissions = permissions.concat(role.permissions);
        });

        const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, permissions, refreshDetail.client);

        return apiResponse(res, httpStatus.OK, {
            access: {
                token: accessTokenDetail._id,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail._id,
                expires: refreshTokenDetail.expires,
            },
            user: user,
            scopes: permissions,
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please loxgin again."
    });
});

const register = catchAsync(async (req, res) => {
    const {name, email, username, password} = req.body;
    const newUser = new UserModel({name, password, username, email});
    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, validation, err);
    }

    const validation = await validationError.uniqueCheck(await UserModel.isUnique(username, email));
    if (Object.keys(validation).length === 0) {
        const newUser2 = await newUser.save();
        return apiResponse(res, httpStatus.CREATED, newUser2);
    } else {
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, validation, newUser);
    }
});

module.exports = {
    login,
    loginUpdate,
    register,
}
