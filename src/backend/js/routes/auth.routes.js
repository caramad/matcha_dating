const express = require("express")
const authController = require("../controllers/auth.controller")

const router = express.Router();

router.use("/register", authController.register);

module.exports = router;