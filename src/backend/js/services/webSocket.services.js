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
			
			socket.emit("roomJoined", { userId, room: socket.id });

		} catch (error) {
			throw new Error("Failed to join room.");
		}
	}

	async sendMessage(socket, receiverId, message) {
		try {
			console.log(`Sending message from ${socket.user.id} to ${receiverId}: ${message}`);
	
			// Check if the receiver is online
			if (this.activeUsers.has(receiverId)) {
				this.io.to(receiverId).emit("receiveMessage", { content: message });
				console.log(`Message delivered to ${receiverId}`);
			} else {
				console.log(`User ${receiverId} is offline. Message not delivered.`);
				socket.emit("userOffline", { receiverId, message });
			}
	
			socket.emit("messageSent", { receiverId, message });
	
		} catch (error) {
			console.error(`Error in WebSocketService.sendMessage: ${error.message}`);
			throw error;
		}
	}

	handleDisconnect(socket) {
		try {
			for (let [userId, sockObj] of this.activeUsers.entries()) {
				if (sockObj.id === socket.id) {
					this.activeUsers.delete(userId);
					console.log(`User ${userId} disconnected.`);
					break;
				}
			}
		} catch (error) {
			throw new Error("Failed to disconnect user.");
		}
	}
}

module.exports = WebSocketService;
