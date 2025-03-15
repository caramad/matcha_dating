const db = require("../config/db");

class User {
	constructor(id, email, password) {
		this.id = id;
		this.email = email;
		this.password = password;
	}

	// find by id
	static async findById(id) {
		const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
		if (rows.length === 0) {
			return null;
		}
		return new User(rows[0].id, rows[0].email, rows[0].password);
	}

	// Find user by email
	static async findByEmail(email) {
		const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
		if (rows.length === 0) {
			return null;
		}
		return new User(rows[0].id, rows[0].email, rows[0].password);
	}

	// Create a new user and return the inserted user
	static async create(email, hashedPassword) {
		const { rows } = await db.query(
			"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
			[email, hashedPassword]
		);
		return new User(rows[0].id, rows[0].email, rows[0].password);
	}

	// Update user details
	async update() {
		await db.query(
			"UPDATE users SET email = $1, password = $2 WHERE id = $3",
			[this.email, this.password, this.id]
		);
	}

	// Delete user
	async delete() {
		await db.query("DELETE FROM users WHERE id = $1", [this.id]);
	}
}

module.exports = User;