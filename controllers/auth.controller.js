const jsonwebtoken = require("jsonwebtoken");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const moment = require("moment");

const apiResponse = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");
const validationError = require("../utils/validationError");

const {UserModel} = require("../models/user.model");
const {RoleModel} = require("../models/role.model");
const {OAuthAccessTokenModel} = require("../models/oAuthAccessToken.model");
const {OAuthRefreshTokenModel} = require("../models/oAuthRefreshToken.model");

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

    const role = await RoleModel.findOne({_id: user.role._id}, {permissions: true});
    const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, role && role.permissions ? role.permissions : [], req.client._id);

    return apiResponse(res, httpStatus.CREATED, {
        data: {
            access: {
                token: accessTokenDetail._id,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail._id,
                expires: refreshTokenDetail.expires,
            },
            user: user,
            scopes: role && role.permissions ? role.permissions : [],
        },
        message: "Login Successful"
    });
});

const renew = catchAsync(async (req, res) => {
    const {access, refresh} = req.body;

    const accessDetail = await OAuthAccessTokenModel.findOne({ _id: access, revoked: false });
    const refreshDetail = await OAuthRefreshTokenModel.findOne({ _id: refresh, accessToken: access, revoked: false, expires: {$gte: moment().format()} });

    if (accessDetail && refreshDetail) {
        const user = await UserModel.findOne({_id: accessDetail.user})

        await OAuthAccessTokenModel.updateOne({_id: accessDetail._id}, { revoked: true });
        await OAuthRefreshTokenModel.updateOne({_id: refreshDetail._id}, { revoked: true });
        const role = await RoleModel.findOne({_id: user.role._id}, {permissions: true});
        const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, role && role.permissions ? role.permissions : [], req.client._id);

        return apiResponse(res, httpStatus.CREATED, {
            data: {
                access: {
                    token: accessTokenDetail._id,
                    expires: accessTokenDetail.expires,
                },
                refresh: {
                    token: refreshTokenDetail._id,
                    expires: refreshTokenDetail.expires,
                },
                user: user,
            },
            message: "Token Renewed."
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
});

const register = catchAsync(async (req, res) => {
    const {firstName, lastName, gender, phone, email, username, password, superAdmin} = req.body;
    const newUser = new UserModel({password, username, email, superAdmin, personal: {firstName, lastName, gender, phone: [phone]}});
    const err = newUser.validateSync();
    if (err instanceof mongoose.Error) {
        const validation = await validationError.requiredCheck(err.errors);
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, validation, err);
    }

    const validation = await validationError.uniqueCheck(await UserModel.isUnique(username, email));
    if (Object.keys(validation).length === 0) {
        const user = await newUser.save();

        const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailAndRefreshTokenDetail(user, [], req.client._id);
        return apiResponse(res, httpStatus.CREATED, {
            data: {
                access: {
                    token: accessTokenDetail._id,
                    expires: accessTokenDetail.expires,
                },
                refresh: {
                    token: refreshTokenDetail._id,
                    expires: refreshTokenDetail.expires,
                },
                user: user,
            },
            message: "Registration complete."
        });
    } else {
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Validation Required"}, validation);
    }
});

const logout = catchAsync(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (accessToken) {
        const accessDetails = await OAuthAccessTokenModel.findByIdAndUpdate(accessToken, {revoked: true});
        await OAuthRefreshTokenModel.updateOne({accessToken: accessDetails._id}, {revoked: true});

        return apiResponse(res, httpStatus.ACCEPTED, {
            message: "Logout Successful"
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expired. Please login again."
    });
});

module.exports = {
    login,
    renew,
    register,
    logout
}
