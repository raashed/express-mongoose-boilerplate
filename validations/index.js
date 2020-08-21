const {pick} = require('lodash');
const Joi = require('@hapi/joi');
const ApiError = require("./../utils/ApiError");
const httpStatus = require("http-status");

const validate = (schema) => async (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object, {abortEarly: false});

    if (error) {
        const err = {};
        await error.details.forEach(e => {
            err[e.path[1]] = e.message.toString();
            console.log(e.path)
        });
        const apiError = new ApiError(httpStatus.UNPROCESSABLE_ENTITY, err, true, error);
        return next(apiError);
    }


    Object.assign(req, value);
    return  next();
};

const {login, loginUpdate, register,} = require("./../validations/auth.validation");

module.exports = {
    loginValidation: validate(login),
    loginUpdateValidation: validate(loginUpdate),
    registerValidation: validate(register),
}
