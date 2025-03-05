const db = require("../config/db");

class UserMatch {
	constructor(user_id, matched_user_id, created_at) {
		this.user_id = user_id;
		this.matched_user_id = matched_user_id;
		this.created_at = created_at;
	}

	static async createMatch(user_id, matched_user_id) {
		const { rows } = await db.query(
			"INSERT INTO user_matches (user_id, matched_user_id) VALUES ($1, $2) RETURNING *",
			[user_id, matched_user_id]
		);
		return new UserMatch(rows[0].user_id, rows[0].matched_user_id, rows[0].created_at);
	}

	static async deleteMatch(user_id, matched_user_id) {
		await db.query(
			"DELETE FROM user_matches WHERE user_id = $1 AND matched_user_id = $2",
			[user_id, matched_user_id]
		);
	}

	static async getUserMatches(user_id) {
		const { rows } = await db.query(
			"SELECT * FROM user_matches WHERE user_id = $1",
			[user_id]
		);
		return rows.map(row => new UserMatch(row.user_id, row.matched_user_id, row.created_at));
	}

	static async getMatchesWithUser(matched_user_id) {
		const { rows } = await db.query(
			"SELECT * FROM user_matches WHERE matched_user_id = $1",
			[matched_user_id]
		);
		return rows.map(row => new UserMatch(row.user_id, row.matched_user_id, row.created_at));
	}

}

module.exports = UserMatch;