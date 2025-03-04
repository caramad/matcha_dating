const db = require("../config/db");

class Interest {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	/**
	 * Returns an interest with the specified name
	 * @param {string} name - name of the interest
	 * @returns {Interest} - interest with the specified name
	 */
	static async findByName(name) {
		const { rows } = await db.query("SELECT * FROM interests WHERE name = $1", [name]);
		if (rows.length === 0) {
			return null;
		}
		return new Interest(rows[0].id, rows[0].name);
	}

	/**
	 * Creates a new interest
	 * @param {string} name - name of the interest
	 * @returns {Interest} - inserted interest
	 */
	static async create(name) {
		const { rows } = await db.query("INSERT INTO interests (name) VALUES ($1) RETURNING *", [name]);
		return new Interest(rows[0].id, rows[0].name);
	}

	/**
	 * Updates interest
	 */
	async update() {
		await db.query("UPDATE interests SET name = $1 WHERE id = $2", [this.name, this.id]);
	}

	/**
	 * Deletes interest
	 */
	async delete() {
		await db.query("DELETE FROM interests WHERE id = $1", [this.id]);
	}
}

module.exports = Interest;