const WebSocketService = require("../services/webSocket.services");
const errorHandler = require("../middlewares/error.middleware");
const MessageService = require("../services/message.services");
const chatMiddleware = require("../middlewares/chat.middleware");

class WebSocketController {
	constructor(io) {
		this.io = io;
		this.webSocketService = new WebSocketService(io);
	}

	handleConnection(socket) {
		console.log(`User connected: ${socket.user.id}`);

		// Handle user joining chat
		socket.on("join", async (data, callback) => {
			try {
				this.webSocketService.joinRoom(socket, socket.user.id);
				if (typeof callback === "function") {
					callback({ message: "Joined chat successfully" });
				}
			} catch (error) {
				console.error(`Error joining chat for user ${socket.user.id}:`, error);
				errorHandler.handleWsError(error, socket);
			}
		});

		// Handle sending messages
		socket.on("sendMessage", async (data, callback) => {
			try {
				await chatMiddleware.validateChatMessageSocket(data, socket);
				const senderId = socket.user.id;
				const receiverId = data.receiverId;
				const message = data.message;

				await MessageService.sendMessage(senderId, receiverId, message);
				await this.webSocketService.sendMessage(socket, receiverId, message);

				if (typeof callback === "function") {
					callback({ message: "Message sent successfully" });
				}
			} catch (error) {
				console.error(`Error sending message from user ${socket.user.id}:`, error);
				errorHandler.handleWsError(error, socket);
			}
		});


		// Handle receiving messages
		socket.on("receiveMessage", (data) => {
			try {
				console.log(`Message received by user #${socket.user.id}: ${data.message}`);
			} catch (error) {
				console.error(`Error receiving message for user ${socket.user.id}:`, error);
				errorHandler.handleWsError(error, socket);
			}
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			try {
				this.webSocketService.handleDisconnect(socket);
			} catch (error) {
				console.error(`Error handling disconnect for ${socket.user.id}:`, error);
				errorHandler.handleWsError(error, socket);
			}
		});

		// Handle socket-level errors
		socket.on("error", (error) => {
			console.error(`Error from user ${socket.user.id}: ${error.message}`);
			errorHandler.handleWsError(error, socket);
		});
	}
}

module.exports = WebSocketController;
