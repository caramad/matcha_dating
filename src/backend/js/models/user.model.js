const db = require("../config/db");

class User {
	constructor(id, name, email, password) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
	}

	// Find user by email
	static async findByEmail(email) {
		const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
		if (rows.length === 0) {
			return null;
		}
		return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password);
	}

	// Create a new user and return the inserted user
	static async create(name, email, hashedPassword) {
		const { rows } = await db.query(
			"INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
			[name, email, hashedPassword]
		);
		return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password);
	}

	// Update user details
	async update() {
		await db.query(
			"UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
			[this.name, this.email, this.password, this.id]
		);
	}

	// Delete user
	async delete() {
		await db.query("DELETE FROM users WHERE id = $1", [this.id]);
	}
}

module.exports = User;