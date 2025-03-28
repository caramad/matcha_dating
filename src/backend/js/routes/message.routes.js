const express = require("express");
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.validUserTokenHttp, messageController.getUserMessages);
router.get("/:receiverId", authMiddleware.validUserTokenHttp, messageController.getMessagesBetweenUsers);

module.exports = router;