const express = require("express")
const authController = require("../controllers/auth.controller")
//const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

router.use("/register", authController.register);
router.use("/login", authController.login);

module.exports = router;