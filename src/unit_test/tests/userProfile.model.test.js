const db = require("../backend/config/db");
const UserProfile = require("../backend/models/userProfile.model");
const normalizeSQL = require("./utils");

jest.mock("../backend/config/db", () => ({
	query: jest.fn(),
}));

describe("UserProfile Model", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findByUserId", () => {
		it("should return a UserProfile instance when found", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						id: 1,
						user_id: 10,
						name: "John Doe",
						age: 25,
						gender: "Male",
						sexuality: "Heterosexual",
						bio: "Hello world!",
						location: "[-74.006, 40.7128]",
					},
				],
			});

			const userProfile = await UserProfile.findByUserId(10);

			expect(userProfile).toBeInstanceOf(UserProfile);
			expect(userProfile.id).toBe(1);
			expect(userProfile.userId).toBe(10);
			expect(userProfile.name).toBe("John Doe");
			expect(userProfile.location).toEqual([-74.006, 40.7128]);
			expect(db.query).toHaveBeenCalledWith(
				`SELECT id, user_id, name, age, gender, sexuality, bio, 
                    (ST_AsGeoJSON(location)::json->'coordinates') AS location 
             FROM user_profiles 
             WHERE user_id = $1`,
				[10]
			);
		});

		it("should return null if user is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const userProfile = await UserProfile.findByUserId(99);

			expect(userProfile).toBeNull();
			expect(db.query).toHaveBeenCalled();
		});
	});

	describe("findByAttributes", () => {
		it("should return users matching the criteria", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						id: 2,
						name: "Jane Doe",
						age: 30,
						gender: "Female",
						sexuality: "Heterosexual",
						bio: "Adventurer",
						location: "[-118.2437, 34.0522]",
						distance: 5.5,
					},
				],
			});

			const result = await UserProfile.findByAttributes(
				"Jane Doe",
				30,
				"Female",
				"Heterosexual",
				"Adventurer",
				[-118.2437, 34.0522],
				10
			);

			expect(result.userProfile).toBeInstanceOf(UserProfile);
			expect(result.userProfile.name).toBe("Jane Doe");
			expect(result.userProfile.location).toEqual([-118.2437, 34.0522]);
			expect(result.distance).toBe(5.5);
			expect(db.query).toHaveBeenCalled();
		});

		it("should return null if no users are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const result = await UserProfile.findByAttributes(
				"Jane Doe",
				30,
				"Female",
				"Heterosexual",
				"Adventurer",
				[-118.2437, 34.0522],
				10
			);

			expect(result).toBeNull();
			expect(db.query).toHaveBeenCalled();
		});

		it("should return users matching the criteria without location", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						id: 2,
						name: "Jane Doe",
						age: 30,
						gender: "Bisexual",
						sexuality: "Heterosexual",
						bio: "Adventurer",
						location: "[-118.2437, 34.0522]",
					},
				],
			});

			const result = await UserProfile.findByAttributes(
				"Jane Doe",
				30,
				"Bisexual",
				"Heterosexual",
				"Adventurer",
				null,
				null
			);

			const expectedQuery = `SELECT id, user_id, name, age, gender, sexuality, bio, 
			(ST_AsGeoJSON(location)::json->'coordinates') AS location
			FROM user_profiles
			WHERE 1=1 AND name = $1 AND age = $2
			AND gender = $3 AND sexuality = $4 AND bio = $5`;

			expect(result.userProfile).toBeInstanceOf(UserProfile);
			expect(result.userProfile.name).toBe("Jane Doe");
			expect(result.userProfile.location).toEqual([-118.2437, 34.0522]);
			expect(result.distance).toBeUndefined();
			const actualQuery = normalizeSQL(db.query.mock.calls[0][0]);
			const normalizedExpectedQuery = normalizeSQL(expectedQuery);
			expect(actualQuery).toBe(normalizedExpectedQuery);
		});
	});

});

describe("create", () => {
	it("should insert and return a new user profile", async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 3,
					user_id: 15,
					name: "Alice",
					age: 28,
					gender: "Female",
					sexuality: "Bisexual",
					bio: "Love hiking!",
					location: "[-122.4194, 37.7749]",
				},
			],
		});

		const newUserProfile = await UserProfile.create(
			15,
			"Alice",
			28,
			"Female",
			"Bisexual",
			"Love hiking!",
			[-122.4194, 37.7749]
		);

		expect(newUserProfile).toBeInstanceOf(UserProfile);
		expect(newUserProfile.name).toBe("Alice");
		expect(newUserProfile.location).toEqual([-122.4194, 37.7749]);
		expect(db.query).toHaveBeenCalledWith(
			`INSERT INTO user_profiles (user_id, name, age, gender, sexuality, bio, location) 
             VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326)) RETURNING id, user_id, name, age, gender, sexuality, bio, (ST_AsGeoJSON(location)::json->'coordinates') AS location`,
			[15, "Alice", 28, "Female", "Bisexual", "Love hiking!", -122.4194, 37.7749]
		);
	});
});

describe("update", () => {
	it("should update an existing user profile", async () => {
		const userProfile = new UserProfile(4, 20, "Bob", 32, "Male", "Homosexual", "Tech enthusiast", [-73.935242, 40.73061]);

		db.query.mockResolvedValueOnce({ rowCount: 1 });

		await userProfile.update();

		expect(db.query).toHaveBeenCalledWith(
			"UPDATE user_profiles SET name = $1, age = $2, gender = $3, sexuality = $4, bio = $5, location = ST_SetSRID(ST_MakePoint($6, $7), 4326) WHERE id = $8",
			["Bob", 32, "Male", "Homosexual", "Tech enthusiast", -73.935242, 40.73061, 4]
		);
	});
});

describe("delete", () => {
	it("should delete a user profile", async () => {
		const userProfile = new UserProfile(5, 25, "Charlie", 29, "Male", "Heterosexual", "Traveler", [-77.0369, 38.9072]);

		db.query.mockResolvedValueOnce({ rowCount: 1 });

		await userProfile.delete();

		expect(db.query).toHaveBeenCalledWith("DELETE FROM user_profiles WHERE id = $1", [5]);
	});
});
