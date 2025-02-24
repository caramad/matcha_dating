const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Set max JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Set max form data size

app.use("/", routes);
app.use(errorHandler);

db.connect();
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});