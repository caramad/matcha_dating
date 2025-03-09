const { Server } = require("socket.io");
const WebSocketController = require("../controllers/webSocket.controller");
const authMiddleware = require("../middlewares/auth.middleware");

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
        path: "/socket.io/"
    });

    const webSocketController = new WebSocketController(io);

    io.use(authMiddleware.validUserTokenWs);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        webSocketController.handleConnection(socket);
    });

    return io;
}

module.exports = initializeWebSocket;
