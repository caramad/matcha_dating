const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", authMiddleware.validateRegister, authController.register);
router.post("/login", authMiddleware.validateLogin, authController.login);
router.post("/refresh", authMiddleware.validateRefreshToken, authController.refreshToken);
//router.post("/logout", authMiddleware.validateLogout, authController.logout);
//router.put("/update", authMiddleware.validateUpdate, authController.update);
//router.delete("/delete", authMiddleware.validateDelete, authController.delete);

module.exports = router;