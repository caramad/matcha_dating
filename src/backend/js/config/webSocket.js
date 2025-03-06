const { Server } = require("socket.io");
//const { saveMessageToDB } = require("../services/message.services");

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: "/socket.io/"
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendMessage", async (message) => {
            console.log("Message received:", message);

            // Emit message to the recipient
            io.to(message.receiverId).emit("receiveMessage", message);

            // Save the message to the database
            //await saveMessageToDB(message);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = initializeWebSocket;
