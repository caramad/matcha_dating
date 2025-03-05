db = require("../config/db");

class UserAttribute {
	constructor(user_id, attribute_key, attribute_value) {
		this.user_id = user_id;
		this.attribute_key = attribute_key;
		this.attribute_value = attribute_value;
	}

	static async findByUserId(user_id) {
		const { rows } = await db.query("SELECT * FROM user_attributes WHERE user_id = $1", [user_id]);
		return rows.map(row => new UserAttribute(row.user_id, row.attribute_key, row.attribute_value));
	}

	static async create(user_id, attribute_key, attribute_value) {
		await db.query("INSERT INTO user_attributes (user_id, attribute_key, attribute_value) VALUES ($1, $2, $3)", [user_id, attribute_key, attribute_value]);
		return new UserAttribute(user_id, attribute_key, attribute_value);
	}

	static async update(user_id, attribute_key, attribute_value) {
		await db.query("UPDATE user_attributes SET attribute_value = $1 WHERE user_id = $2 AND attribute_key = $3", [attribute_value, user_id, attribute_key]);
	}

	static async delete(user_id, attribute_key) {
		await db.query("DELETE FROM user_attributes WHERE user_id = $1 AND attribute_key = $2", [user_id, attribute_key]);
	}
}

module.exports = UserAttribute;