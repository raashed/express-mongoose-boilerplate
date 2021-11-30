const {pick} = require('lodash');
const Joi = require('@hapi/joi');
const httpStatus = require("http-status");

const ApiError = require("./../utils/ApiError");

const validate = (schema) => async (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object, {abortEarly: false});

    if (error) {
        const message = error && error.details && error.details.length ? error.details[0].message : "Something went wrong!";
        const err = {};
        await error.details.forEach(e => {
            err[e.path[1]] = e.message.toString();
        });
        const apiError = new ApiError(httpStatus.UNPROCESSABLE_ENTITY, {message}, true, err);
        return next(apiError);
    }


    Object.assign(req, value);
    return  next();
};

module.exports = {validate};
