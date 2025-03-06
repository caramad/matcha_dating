const express = require("express")
const authRoutes = require("./auth.routes")
const pingRoutes = require("./ping.routes")
const messageRoutes = require("./message.routes")

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ping", pingRoutes);
router.use("/messages", messageRoutes)

module.exports = router;