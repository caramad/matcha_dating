const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", authMiddleware.validateRegister, authController.register);
router.post("/login", authMiddleware.validateLogin, authController.login);

module.exports = router;