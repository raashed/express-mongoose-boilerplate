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

    returnObject["data"] = data && data.data ? data.data : null;
    returnObject["message"] = data && data.message ? data.message : null;
    returnObject["stack"] = typeof optional !== "undefined" && Object.keys(optional).length > 0 ? optional : null;

    res.status(status);
    return res.json(returnObject);
};
