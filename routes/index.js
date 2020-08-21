const express = require("express");
const ApiError = require("./../utils/ApiError");
const apiResponse = require("../utils/apiResponse");
const httpStatus = require("http-status");

const router = express.Router();

const guestRoute = require("./guest.route");
const authRoute = require("./auth.route");

/**
 * @swagger
 *
 * /:
 *   get:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.use("/", guestRoute);

/**
 * @swagger
 *
 * /auth:
 *   get:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.use("/auth", authRoute);

// send back a 404 error for any unknown api request
router.use((req, res, next) => {
    const error = new ApiError(httpStatus.NOT_FOUND);
    return next(error);
});

// convert error to ApiError, if needed
router.use((error, req, res, next) => {
    const status = error.statusCode || res.statusCode || 500;
    const stack = process.env.NODE_ENVIRONMENT !== "production" ? error.stack : {};

    return apiResponse(res, status, error.message, stack);
});

module.exports = router;
