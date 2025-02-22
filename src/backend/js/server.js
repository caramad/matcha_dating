const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes");
//const errorHandler = require("./middlewares/error.middleware")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

db.connectDB();

// Routes
app.use("/", routes)

// Global Error Handler
//app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
