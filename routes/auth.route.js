const express = require("express");
const router = express.Router();

const {isClientAuthenticated, isAuthenticated} = require("./../middlewares/auth.middleware");
const {login, renew, register, logout} = require("./../controllers/auth.controller");
const {loginValidation, renewValidation, registerValidation} = require("./../validations/auth.validation");

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     description: Login to server
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to login.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email | string
 *             password:
 *               type: string
 *               format: password
 *           example:
 *             email: fake@email.com
 *             password: Alexander
 *     responses:
 *       200:
 *         description: Created
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *           examples:
 *             application/json: {
 *               "id": 1,
 *               "username": "someuser"
 *             }
 *       401:
 *         description: Validation error
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: Object
 *               properties:
 *                 message:
 *                 type: string
 *           examples:
 *             application/json: {
 *               "data": {,
 *                 "message": "Invalid email or username. Please register first."
 *               }
 *             }
 */
router.post("/login", isClientAuthenticated, loginValidation, login);

/**
 * @swagger
 *
 * /auth/renew:
 *   post:
 *     description: Renew authentication
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - username
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation error
 */
router.post("/renew", isClientAuthenticated, renewValidation, renew);

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     description: Register a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - username
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation error
 */
router.post("/register", isClientAuthenticated, registerValidation, register);
router.delete("/logout", isAuthenticated(''), logout);

module.exports = router;
