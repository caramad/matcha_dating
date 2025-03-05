const db = require("../backend/config/db");
const UserDislike = require("../backend/models/userDislike.model");

jest.mock("../backend/config/db", () => ({
	query: jest.fn(),
}));

describe("UserDislike Model", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("dislikeUser", () => {
		it("should insert and return a new UserDislike instance", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user_id: 1, disliked_user_id: 2, created_at: "2024-03-05T12:00:00Z" }],
			});

			const dislike = await UserDislike.dislikeUser(1, 2);

			expect(dislike).toBeInstanceOf(UserDislike);
			expect(dislike.user_id).toBe(1);
			expect(dislike.disliked_user_id).toBe(2);
			expect(dislike.created_at).toBe("2024-03-05T12:00:00Z");
			expect(db.query).toHaveBeenCalledWith(
				"INSERT INTO user_dislikes (user_id, disliked_user_id) VALUES ($1, $2) RETURNING *",
				[1, 2]
			);
		});
	});

	describe("removeDislike", () => {
		it("should delete a user dislike", async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			await UserDislike.removeDislike(1, 2);

			expect(db.query).toHaveBeenCalledWith(
				"DELETE FROM user_dislikes WHERE user_id = $1 AND disliked_user_id = $2",
				[1, 2]
			);
		});
	});

	describe("getDislikesByUser", () => {
		it("should return an array of UserDislike instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 1, disliked_user_id: 2, created_at: "2024-03-05T12:00:00Z" },
					{ user_id: 1, disliked_user_id: 3, created_at: "2024-03-06T14:00:00Z" },
				],
			});

			const dislikes = await UserDislike.getDislikesByUser(1);

			expect(dislikes).toHaveLength(2);
			expect(dislikes[0]).toBeInstanceOf(UserDislike);
			expect(dislikes[1]).toBeInstanceOf(UserDislike);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_dislikes WHERE user_id = $1", [1]);
		});

		it("should return an empty array if no dislikes are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const dislikes = await UserDislike.getDislikesByUser(99);
			expect(dislikes).toEqual([]);
		});
	});

	describe("getUsersWhoDisliked", () => {
		it("should return an array of UserDislike instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 4, disliked_user_id: 2, created_at: "2024-03-05T15:00:00Z" },
					{ user_id: 5, disliked_user_id: 2, created_at: "2024-03-07T18:00:00Z" },
				],
			});

			const dislikedBy = await UserDislike.getUsersWhoDisliked(2);

			expect(dislikedBy).toHaveLength(2);
			expect(dislikedBy[0]).toBeInstanceOf(UserDislike);
			expect(dislikedBy[1]).toBeInstanceOf(UserDislike);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_dislikes WHERE disliked_user_id = $1", [2]);
		});

		it("should return an empty array if no dislikes are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const dislikedBy = await UserDislike.getUsersWhoDisliked(99);
			expect(dislikedBy).toEqual([]);
		});
	});
});
