db = require("../config/db");

/* UserPreference model
 * @class UserPreference
 */
class UserPreference {
	constructor(userId, preferredGender, minAge, maxAge, locationRadius) {
		this.userId = userId;
		this.preferredGender = preferredGender;
		this.minAge = minAge;
		this.maxAge = maxAge;
		this.locationRadius = locationRadius;
	}

	/* Find user preference by user ID
	 * @param {number} userId - ID for a specific user
	 * @returns {UserPreference} - user preference with the specified user ID
	 */
	static async findByUserId(userId) {
		const { rows } = await db.query("SELECT * FROM user_preferences WHERE user_id = $1", [userId]);
		if (rows.length === 0) {
			return null;
		}
		return new UserPreference(rows[0].user_id,
									rows[0].preferred_gender,
									rows[0].min_age,
									rows[0].max_age,
									rows[0].location_radius
								);
	}

	/* Create a new user preference and return the inserted user preference
	 * @param {number} userId - ID for a specific user
	 * @param {string} preferredGender
	 * @param {number} minAge
	 * @param {number} maxAge
	 * @param {number} locationRadius
	 * @returns {UserPreference} - inserted user preference
	 */
	static async create(userId, preferredGender, minAge, maxAge, locationRadius) {
		const { rows } = await db.query(
			"INSERT INTO user_preferences (user_id, preferred_gender, min_age, max_age, location_radius) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[userId, preferredGender, minAge, maxAge, locationRadius]
		);
		return new UserPreference(rows[0].user_id,
									rows[0].preferred_gender,
									rows[0].min_age,
									rows[0].max_age,
									rows[0].location_radius
								);
	}

	/* Update user preference
	 */
	async update() {
		await db.query(
			"UPDATE user_preferences \
			SET preferred_gender = $1, \
			 min_age = $2, \
			 max_age = $3, \
			 location_radius = $4 \
			 WHERE user_id = $5",
			[this.preferredGender, this.minAge, this.maxAge, this.locationRadius, this.userId]
		);
	}

	/* Delete user preference
	 */
	async delete() {
		await db.query("DELETE FROM user_preferences WHERE user_id = $1", [this.userId]);
	}

	/**
	 * Returns a user preference with the specified attributes
	 * @param {string} preferredGender
	 * @param {number} minAge
	 * @param {number} maxAge
	 * @param {number} locationRadius
	 * @returns {UserPreference} - user preference with the specified attributes
	 */
	static async findByAttributes(preferredGender, minAge, maxAge, locationRadius) {
		let query = "SELECT * FROM user_preferences WHERE 1=1"; // 1=1 allows appending of conditions
		const params = [];
		let paramIndex = 1;
	
		if (preferredGender !== null) {
			query += ` AND preferred_gender = $${paramIndex++}`;
			params.push(preferredGender);
		}
		if (minAge !== null) {
			query += ` AND min_age >= $${paramIndex++}`;
			params.push(minAge);
		}
		if (maxAge !== null) {
			query += ` AND max_age <= $${paramIndex++}`;
			params.push(maxAge);
		}
		if (locationRadius !== null) {
			query += ` AND location_radius <= $${paramIndex++}`;
			params.push(locationRadius);
		}
	
		const { rows } = await db.query(query, params);
	
		if (rows.length === 0) {
			return null;
		}
	
		return new UserPreference(
			rows[0].user_id,
			rows[0].preferred_gender,
			rows[0].min_age,
			rows[0].max_age,
			rows[0].location_radius
		);
	}
}

module.exports = UserPreference;