const { Server } = require("socket.io");
const WebSocketController = require("../controllers/webSocket.controller");

function initializeWebSocket(server) {
    const io = new Server(server, {
		cors: { origin: "*", methods: ["GET", "POST"] },
        path: "/socket.io/"
    });

    const webSocketController = new WebSocketController(io);

    io.on("connection", (socket) => {
        webSocketController.handleConnection(socket);
    });

    return io;
}

module.exports = initializeWebSocket;