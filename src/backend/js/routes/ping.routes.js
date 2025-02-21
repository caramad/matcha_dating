const express = require("express")
const pingController = require("../controllers/ping.controller")

const router = express.Router();

router.use("/", pingController.ping);

module.exports = router;