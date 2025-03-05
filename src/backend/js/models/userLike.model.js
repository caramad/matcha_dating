const db = require("../config/db");

class UserLike {
	constructor(user_id, liked_user_id, created_at) {
		this.user_id = user_id;
		this.liked_user_id = liked_user_id;
		this.created_at = created_at;
	}

	static async likeUser(user_id, liked_user_id) {
		const { rows } = await db.query(
			"INSERT INTO user_likes (user_id, liked_user_id) VALUES ($1, $2) RETURNING *",
			[user_id, liked_user_id]
		);
		return new UserLike(rows[0].user_id, rows[0].liked_user_id, rows[0].created_at);
	}

	static async unlikeUser(user_id, liked_user_id) {
		await db.query(
			"DELETE FROM user_likes WHERE user_id = $1 AND liked_user_id = $2",
			[user_id, liked_user_id]
		);
	}

	static async getUserLikes(user_id) {
		const { rows } = await db.query(
			"SELECT * FROM user_likes WHERE user_id = $1",
			[user_id]
		);
		return rows.map(row => new UserLike(row.user_id, row.liked_user_id, row.created_at));
	}

	static async getUsersWhoLikedUser(liked_user_id) {
		const { rows } = await db.query(
			"SELECT * FROM user_likes WHERE liked_user_id = $1",
			[liked_user_id]
		);
		return rows.map(row => new UserLike(row.user_id, row.liked_user_id, row.created_at));
	}
}

module.exports = UserLike;