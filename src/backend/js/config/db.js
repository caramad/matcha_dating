let db;

// make db a dictionary with user registration data and populate it
const initDB = () => {
	db = {
		users: [
			{
				id: 1,
				name: "admin",
				email: "admin@localhost",
				password: "admin",
			},
		],
	};
}

const connectDB = async () => {
	initDB();
	console.log("DB connected");
}

const getDB = () => {
	if (!db) throw new Error("❌ Database not initialized");
	return db;
}

module.exports = {connectDB, getDB};