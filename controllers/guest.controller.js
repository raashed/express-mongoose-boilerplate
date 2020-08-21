const catchAsync = require("../utils/catchAsync");
const apiResponse = require("../utils/apiResponse");
const httpStatus = require("http-status");

const baseUrl = catchAsync(async (req, res) => {
    return apiResponse(res, httpStatus.OK, "welcome to home page.");
});

module.exports = {
    baseUrl,
}
