const Joi = require('@hapi/joi');

const login = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
};

const loginUpdate = {
    body: Joi.object({
        refresh: Joi.string().required(),
    })
};

const register = {
    body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
};

module.exports = {
    login,
    loginUpdate,
    register,
}
