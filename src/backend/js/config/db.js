const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.on("connect", () => {
	console.log("✅ Database connected");
});

db.on("error", (err) => {
    console.error("❌ Database connection error", err);
    process.exit(1);
});

module.exports = db;
