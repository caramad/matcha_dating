const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sample API route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
