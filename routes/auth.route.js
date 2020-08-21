const express = require("express");
const router = express.Router();
const {login, loginUpdate, register} = require("./../controllers/auth.controller");
const {isClientAuthenticated, isAuthenticated} = require("./../middlewares/auth.middleware");
const {loginValidation, loginUpdateValidation, registerValidation} = require("./../validations");

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
 * /auth/login-update:
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
router.post("/login-update", isAuthenticated(''), loginUpdateValidation, loginUpdate);

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

module.exports = router;
