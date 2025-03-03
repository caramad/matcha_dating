const db = require("../config/db");

class UserProfile {
	constructor(id, userId, name, age, gender, sexuality, bio, location, profilePicture) {
		this.id = id
		this.userId = userId;
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.sexuality = sexuality;
		this.bio = bio;
		this.location = location;
		this.profilePicture = profilePicture;
	}

	static async findByUserId(userId) {
		const { rows } = await db.query("SELECT * FROM user_profiles WHERE user_id = $1", [userId]);
		if (rows.length === 0) {
			return null;
		}
		return new UserProfile(rows[0].id,
								rows[0].user_id,
								rows[0].name,
								rows[0].age,
								rows[0].gender,
								rows[0].sexuality,
								rows[0].bio,
								rows[0].location,
								rows[0].profilePicture
							);

	}

	static async create(userId, name, age, gender, sexuality, bio, location, profilePicture) {
		const { rows } = await db.query(
			"INSERT INTO user_profiles (user_id, name, age, gender, sexuality, bio, location, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
			[userId, name, age, gender, sexuality, bio, location, profilePicture]
		);
		return new UserProfile(rows[0].id,
								rows[0].user_id,
								rows[0].name,
								rows[0].age,
								rows[0].gender,
								rows[0].sexuality,
								rows[0].bio,
								rows[0].location,
								rows[0].profilePicture
							);
		}

	async update() {
		await db.query(
			"UPDATE user_profiles SET name = $1, age = $2, gender = $3, sexuality = $4, bio = $5, location = $6, profile_picture = $7 WHERE id = $8",
			[this.name, this.age, this.gender, this.sexuality, this.bio, this.location, this.profilePicture, this.id]
		);
	}

	async delete() {
		await db.query("DELETE FROM user_profiles WHERE id = $1", [this.id]);
	}

};

module.exports = UserProfile;