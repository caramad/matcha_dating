const MessageService = require("./message.services");

class WebSocketService {
	constructor(io) {
		this.io = io;
		this.activeUsers = new Map();
	}

	joinRoom(socket, userId) {
		this.activeUsers.set(userId, socket);
		socket.join(userId);
		console.log(`User ${userId} joined room ${socket.id}`);
	}

	async sendMessage(socket, { senderId, receiverId, message }) {
		try {
			const savedMessage = await MessageService.saveMessage(senderId, receiverId, message);

			if (this.activeUsers.has(receiverId)) {
				this.io.to(receiverId).emit("receiveMessage", savedMessage);
			}

			socket.emit("messageSent", savedMessage);
		} catch (error) {
			console.error("Error sending message: ", error);
			socket.emit("error", "Message failed to send");
		}
	}

	handleDisconnect(socket) {
		// Remove user from active users when they disconenct
		for (let [userId, sockObj] of this.activeUsers.entries()) {
			if (sockObj.id === socket.id) {
				this.activeUsers.delete(userId);
				console.log(`User ${userId} disconnected.`);
				break;
			}
		}
	}
}

module.exports = WebSocketService;