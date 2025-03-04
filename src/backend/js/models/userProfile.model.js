const db = require("../config/db");

/**
 * User profile model
 */
class UserProfile {
    constructor(id, userId, name, age, gender, sexuality, bio, location) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.sexuality = sexuality;
        this.bio = bio;
        this.location = location; // [longitude, latitude]
    }

    /**
     * Returns a user profile with the specified user ID
     */
    static async findByUserId(userId) {
        const { rows } = await db.query(
            `SELECT id, user_id, name, age, gender, sexuality, bio, 
                    (ST_AsGeoJSON(location)::json->'coordinates') AS location 
             FROM user_profiles 
             WHERE user_id = $1`, 
            [userId]
        );
    
        if (rows.length === 0) {
            return null;
        }
    
        return new UserProfile(
            rows[0].id,
            rows[0].user_id,
            rows[0].name,
            rows[0].age,
            rows[0].gender,
            rows[0].sexuality,
            rows[0].bio,
            JSON.parse(rows[0].location)
        );
    }

    /**
     * Finds users by attributes
	 * @param {string} name - name of the user
	 * @param {number} age - age of the user
	 * @param {string} gender - gender of the user
	 * @param {string} sexuality - sexuality of the user
	 * @param {string} bio - bio of the user
	 * @param {Array} location - location of the user
	 * @param {number} radius - radius of the location
	 * @returns {Object} - user profile and distance
     */
    static async findByAttributes(name, age, gender, sexuality, bio, location, radius) {
        const params = [];
        let paramIndex = 1;
        let query = `SELECT id, user_id, name, age, gender, sexuality, bio, (ST_AsGeoJSON(location)::json->'coordinates') AS location `;
        
        if (location !== null) {
            query += `, ST_Distance(location, ST_MakePoint($${paramIndex++}, $${paramIndex++})::geography) AS distance`;
            params.push(location[0], location[1]);
        }

        query += " FROM user_profiles WHERE 1=1";

        if (name !== null) {
            query += ` AND name = $${paramIndex++}`;
            params.push(name);
        }
        if (age !== null) {
            query += ` AND age = $${paramIndex++}`;
            params.push(age);
        }
        if (gender !== null) {
            query += ` AND gender = $${paramIndex++}`;
            params.push(gender);
        }
        if (sexuality !== null) {
            query += ` AND sexuality = $${paramIndex++}`;
            params.push(sexuality);
        }
        if (bio !== null) {
            query += ` AND bio = $${paramIndex++}`;
            params.push(bio);
        }
        if (location !== null) {
            query += ` AND ST_DWithin(location, ST_MakePoint($1, $2)::geography, $${paramIndex++})`;
            params.push(radius);
        }

        const { rows } = await db.query(query, params);

        if (rows.length === 0) {
            return null;
        }

        return { 
            userProfile: new UserProfile(
                rows[0].id,
				rows[0].user_id,
                rows[0].name, 
                rows[0].age, 
                rows[0].gender, 
                rows[0].sexuality, 
                rows[0].bio, 
                JSON.parse(rows[0].location)
            ), 
            distance: rows[0].distance 
        };
    }

    /**
     * Inserts a new user profile into the database
     */
    static async create(userId, name, age, gender, sexuality, bio, location) {
        const { rows } = await db.query(
            `INSERT INTO user_profiles (user_id, name, age, gender, sexuality, bio, location) 
             VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326)) RETURNING id, user_id, name, age, gender, sexuality, bio, (ST_AsGeoJSON(location)::json->'coordinates') AS location`,
            [userId, name, age, gender, sexuality, bio, location[0], location[1]]
        );
    
        return new UserProfile(
            rows[0].id,
            rows[0].user_id,
            rows[0].name,
            rows[0].age,
            rows[0].gender,
            rows[0].sexuality,
            rows[0].bio,
            JSON.parse(rows[0].location)
        );
    }

    async update() {
        await db.query(
            "UPDATE user_profiles SET name = $1, age = $2, gender = $3, sexuality = $4, bio = $5, location = ST_SetSRID(ST_MakePoint($6, $7), 4326) WHERE id = $8",
            [this.name, this.age, this.gender, this.sexuality, this.bio, this.location[0], this.location[1], this.id]
        );
    }

    async delete() {
        await db.query("DELETE FROM user_profiles WHERE id = $1", [this.id]);
    }
}

module.exports = UserProfile;
