const httpStatus = require("http-status");

/**
 * @param {Response} res
 * @param {number} status
 * @param {Object | Array<Object>} data
 * @param {Object=} optional
 * @return {this}
 * @constructor
 */
module.exports = (res, status, data = {}, optional = {}) => {
    const returnObject = {};
    returnObject["data"] = data;

    if (typeof optional !== "undefined" && Object.keys(optional).length > 0) {
        returnObject["stack"] = optional;
    }

    res.status(status);
    return res.json(returnObject);
};
