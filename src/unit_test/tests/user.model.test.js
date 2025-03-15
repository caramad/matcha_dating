const db = require("../backend/config/db");
const User = require("../backend/models/user.model");

jest.mock("../backend/config/db", () => ({
	query: jest.fn(),
}));

describe("User Model", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findByEmail", () => {
		it("should return a User instance when user is found", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 1, email: "test@example.com", password: "hashedpassword" }
				],
			});

			const user = await User.findByEmail("test@example.com");

			expect(user).toBeInstanceOf(User);
			expect(user.id).toBe(1);
			expect(user.email).toBe("test@example.com");
			expect(user.password).toBe("hashedpassword");
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ["test@example.com"]);
		});

		it("should return null if user is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const user = await User.findByEmail("notfound@example.com");

			expect(user).toBeNull();
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ["notfound@example.com"]);
		});
	});

	describe("findById", () => {
		it("should return a User instance when user is found", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 1, email: "user@example.com", password: "hashedpassword" }
				],
			});
		
			const user = await User.findById(1);

			expect(user).toBeInstanceOf(User);
			expect(user.id).toBe(1);
			expect(user.email).toBe("user@example.com");
			expect(user.password).toBe("hashedpassword");
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [1]);
		});

		it("should return null if user is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const user = await User.findById(999);

			expect(user).toBeNull();
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [999]);
		});
	});

	describe("create", () => {
		it("should insert and return a new User instance", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 2, email: "newuser@example.com", password: "hashedpassword" }
				],
			});

			const newUser = await User.create("newuser@example.com", "hashedpassword");

			expect(newUser).toBeInstanceOf(User);
			expect(newUser.id).toBe(2);
			expect(newUser.email).toBe("newuser@example.com");
			expect(newUser.password).toBe("hashedpassword");
			expect(db.query).toHaveBeenCalledWith(
				"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
				["newuser@example.com", "hashedpassword"]
			);
		});
	});

	describe("update", () => {
		it("should update an existing user", async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			const user = new User(3, "updated@example.com", "newhashedpassword");
			user.email = "changed@example.com";

			await user.update();

			expect(db.query).toHaveBeenCalledWith(
				"UPDATE users SET email = $1, password = $2 WHERE id = $3",
				["changed@example.com", "newhashedpassword", 3]
			);
		});
	});

	describe("delete", () => {
		it("should delete a user", async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			const user = new User(4, "delete@example.com", "password");

			await user.delete();

			expect(db.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [4]);
		});
	});
});
