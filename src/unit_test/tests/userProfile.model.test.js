const db = require("../backend/config/db");
const UserProfile = require("../backend/models/userProfile.model");

jest.mock("../backend/config/db", () => ({
query: jest.fn(),
}));

describe("UserProfile Model", () => {
	afterEach(() => {
	jest.clearAllMocks();
	});

	describe("findByUserId", () => {
	it("should return a UserProfile instance when user is found", async () => {
		db.query.mockResolvedValueOnce({
		rows: [
			{
			id: 1,
			user_id: 101,
			name: "John Doe",
			age: 30,
			gender: "Male",
			sexuality: "Straight",
			bio: "Hello world!",
			location: "NY",
			profile_picture: "profile.jpg",
			},
		],
		});

		const userProfile = await UserProfile.findByUserId(101);

		expect(userProfile).toBeInstanceOf(UserProfile);
		expect(userProfile.id).toBe(1);
		expect(userProfile.name).toBe("John Doe");
		expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_profiles WHERE user_id = $1", [101]);
	});

	it("should return null if user is not found", async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		const userProfile = await UserProfile.findByUserId(999);

		expect(userProfile).toBeNull();
		expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_profiles WHERE user_id = $1", [999]);
	});
	});

	describe("create", () => {
	it("should insert and return a new UserProfile instance", async () => {
		db.query.mockResolvedValueOnce({
		rows: [
			{
			id: 2,
			user_id: 102,
			name: "Jane Doe",
			age: 28,
			gender: "Female",
			sexuality: "Bisexual",
			bio: "I love traveling",
			location: "LA",
			profile_picture: "jane.jpg",
			},
		],
		});

		const newUser = await UserProfile.create(102, "Jane Doe", 28, "Female", "Bisexual", "I love traveling", "LA", "jane.jpg");

		expect(newUser).toBeInstanceOf(UserProfile);
		expect(newUser.id).toBe(2);
		expect(newUser.name).toBe("Jane Doe");
		expect(db.query).toHaveBeenCalledWith(
		"INSERT INTO user_profiles (user_id, name, age, gender, sexuality, bio, location, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
		[102, "Jane Doe", 28, "Female", "Bisexual", "I love traveling", "LA", "jane.jpg"]
		);
	});
	});

	describe("update", () => {
	it("should update an existing user profile", async () => {
		db.query.mockResolvedValueOnce({ rowCount: 1 });

		const user = new UserProfile(3, 103, "Mike", 35, "Male", "Gay", "Software Engineer", "SF", "mike.jpg");
		user.name = "Michael";

		await user.update();

		expect(db.query).toHaveBeenCalledWith(
		"UPDATE user_profiles SET name = $1, age = $2, gender = $3, sexuality = $4, bio = $5, location = $6, profile_picture = $7 WHERE id = $8",
		["Michael", 35, "Male", "Gay", "Software Engineer", "SF", "mike.jpg", 3]
		);
	});
	});

	describe("delete", () => {
	it("should delete a user profile", async () => {
		db.query.mockResolvedValueOnce({ rowCount: 1 });

		const user = new UserProfile(4, 104, "Sara", 27, "Female", "Straight", "Artist", "Seattle", "sara.jpg");

		await user.delete();

		expect(db.query).toHaveBeenCalledWith("DELETE FROM user_profiles WHERE id = $1", [4]);
	});
	});
});
