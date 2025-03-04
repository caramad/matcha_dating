const db = require("../config/db");

class UserInterest {
	constructor(userId, interestId) {
		this.userId = userId;
		this.interestId = interestId;
	}

	/**
	 * Returns an array of user interests with the specified user
	 * @param {number} userId - ID for a specific user
	 * @returns {Array} - user interests with the specified user
	 */
	static async findByUserId(userId) {
		const { rows } = await db.query("SELECT * FROM user_interests WHERE user_id = $1", [userId]);
		return rows.map(row => new UserInterest(row.user_id, row.interest_id));
	}

	/**
	 * Returns an array of user interests with the specified interest
	 * @param {number} interestId - ID for a specific interest
	 * @returns {Array} - user interests with the specified interest
	 */
	static async findByInterestId(interestId) {
		const { rows } = await db.query("SELECT * FROM user_interests WHERE interest_id = $1", [interestId]);
		return rows.map(row => new UserInterest(row.user_id, row.interest_id));
	}

	/**
	 * Returns an array of user ids that have the specified interests.
	 * @param {Array} interests
	 * @returns {Array} user ids
	 */
	static async getUsersWithInterests(interests) {
		const { rows } = await db.query(
			`SELECT user_id FROM user_interests WHERE interest_id IN (${interests.map((_, i) => `$${i + 1}`).join(", ")})`,
			interests.map(interest => interest.id)
		);
		return rows.map(row => row.user_id);
	}

	/**
	 * Inserts a new user interest into the database and returns a new UserInterest object.
	 * @param {number} userId - ID for a specific user
	 * @param {number} interestId - ID for a specific interest
	 * @returns {UserInterest} - Returns a new UserInterest object
	 */
	static async addInterest(userId, interestId) {
		await db.query("INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)", [userId, interestId]);
		return new UserInterest(userId, interestId);
	}

	/**
	 * Removes a user interest from the database.
	 * @param {number} userId - ID for a specific user
	 * @param {number} interestId - ID for a specific
	 */
	static async removeInterest(userId, interestId) {
		await db.query("DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2", [userId, interestId]);
	}
}

module.exports = UserInterest;