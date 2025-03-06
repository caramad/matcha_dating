const express = require("express");
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.validUserToken, messageController.getUserMessages);
router.get("/:receiverId", authMiddleware.validUserToken, messageController.getMessagesBetweenUsers);
router.post("/:receiverId", authMiddleware.validUserToken, messageController.saveMessage);

module.exports = router;