const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes");
const initializeWebSocket = require("./config/webSocket");
const errorHandler = require("./middlewares/error.middleware")
const authMiddleware = require("./middlewares/auth.middleware")
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Set max JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Set max form data size

const io = initializeWebSocket(server);

app.use("/", routes);
app.use(errorHandler.handleHttpError);

db.connect();
server.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});