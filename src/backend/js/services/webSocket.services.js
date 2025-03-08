const MessageService = require("./message.services");

class WebSocketService {
	constructor(io) {
		this.io = io;
		this.activeUsers = new Map();
	}

	joinRoom(socket, userId) {
		try {
			if (this.activeUsers.has(userId)) {
				console.log(`User ${userId} already in room.`);
				throw new Error("User already in room.");
			}
			this.activeUsers.set(userId, socket);
			socket.join(userId);
			console.log(`User ${userId} joined room ${socket.id}`);
		} catch (error) {
			console.error("Error joining room:", error);
			socket.emit("error", "Failed to join room.");
		}

	}

	async sendMessage(socket, { senderId, receiverId, message }) {
		try {
			if (senderId == receiverId) {
				throw new Error("Cannot send message to self");
			}
	
			const savedMessage = await MessageService.saveMessage(senderId, receiverId, message);
	
			if (this.activeUsers.has(receiverId)) {
				this.io.to(receiverId).emit("receiveMessage", savedMessage);
			}
	
			socket.emit("messageSent", savedMessage);
		} catch (error) {
			console.error("Error sending message:", error);
			socket.emit("error", "Message failed to send");
		}
	}

	handleDisconnect(socket) {
		try {
			// Remove user from active users when they disconenct
			for (let [userId, sockObj] of this.activeUsers.entries()) {
				if (sockObj.id === socket.id) {
					this.activeUsers.delete(userId);
					console.log(`User ${userId} disconnected.`);
					break;
				}
			}
		} catch (error) {
			console.error("Error handling disconnection:", error);
			socket.emit("error", "Failed to disconnect.");
		}
	}
}

module.exports = WebSocketService;