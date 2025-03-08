const WebSocketService = require("../services/webSocket.services");

class WebSocketController {
	constructor(io) {
		this.io = io;
		this.webSocketService = new WebSocketService(io);
	}

	handleConnection(socket) {
		console.log(`User connected: ${socket.user.id}`);

		// Handle user joining chat
		socket.on("join", () => {
			const userId = socket.user.id;
			console.log(`User ${userId} joined chat`);
			this.webSocketService.joinRoom(socket, userId);
		});
  

		// Handle sending messages
		socket.on("sendMessage", async (data) => {
			const senderId = socket.user.id;
			data = { ...data, senderId };
		  
			console.log(`Message sent by user #${data.senderId} to user #${data.receiverId}: ${data.message}`);
			await this.webSocketService.sendMessage(socket, data);
		});

		// Handle receiving messages
		socket.on("receiveMessage", (data) => {
			console.log(`Message received by user #${socket.user.id}: ${data.message}`);
		});
		  

		// Handle disconenction
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.user.id}`);
			this.webSocketService.handleDisconnect(socket);
		});
	}
	
}

module.exports = WebSocketController;