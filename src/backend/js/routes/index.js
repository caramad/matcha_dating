const express = require("express")
const authRoutes = require("./auth.routes")
const pingRoutes = require("./ping.routes")

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ping", pingRoutes);

module.exports = router;