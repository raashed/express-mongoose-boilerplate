const Joi = require('@hapi/joi');
const {validate} = require("../utils/validate");

const login = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
};

const renew = {
    body: Joi.object({
        access: Joi.string().required(),
        refresh: Joi.string().required(),
    })
};

const register = {
    body: Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(11).required(),
        gender: Joi.string().required(),
        superAdmin: Joi.boolean().required(),
        password: Joi.string().regex(/^[\w]{6,30}$/).required()
    })
};

module.exports = {
    loginValidation: validate(login),
    renewValidation: validate(renew),
    registerValidation: validate(register)
}
