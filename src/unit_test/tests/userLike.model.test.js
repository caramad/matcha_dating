const db = require("../backend/config/db");
const UserLike = require("../backend/models/userLike.model");

jest.mock("../backend/config/db", () => ({
	query: jest.fn(),
}));

describe("UserLike Model", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("likeUser", () => {
		it("should insert and return a new UserLike instance", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user_id: 1, liked_user_id: 2, created_at: "2024-03-05T12:00:00Z" }],
			});

			const like = await UserLike.likeUser(1, 2);

			expect(like).toBeInstanceOf(UserLike);
			expect(like.user_id).toBe(1);
			expect(like.liked_user_id).toBe(2);
			expect(like.created_at).toBe("2024-03-05T12:00:00Z");
			expect(db.query).toHaveBeenCalledWith(
				"INSERT INTO user_likes (user_id, liked_user_id) VALUES ($1, $2) RETURNING *",
				[1, 2]
			);
		});
	});

	describe("unlikeUser", () => {
		it("should delete a user like", async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			await UserLike.unlikeUser(1, 2);

			expect(db.query).toHaveBeenCalledWith(
				"DELETE FROM user_likes WHERE user_id = $1 AND liked_user_id = $2",
				[1, 2]
			);
		});
	});

	describe("getUserLikes", () => {
		it("should return an array of UserLike instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 1, liked_user_id: 2, created_at: "2024-03-05T12:00:00Z" },
					{ user_id: 1, liked_user_id: 3, created_at: "2024-03-06T14:00:00Z" },
				],
			});

			const likes = await UserLike.getUserLikes(1);

			expect(likes).toHaveLength(2);
			expect(likes[0]).toBeInstanceOf(UserLike);
			expect(likes[1]).toBeInstanceOf(UserLike);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_likes WHERE user_id = $1", [1]);
		});

		it("should return an empty array if no likes are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const likes = await UserLike.getUserLikes(99);
			expect(likes).toEqual([]);
		});
	});

	describe("getUsersWhoLikedUser", () => {
		it("should return an array of UserLike instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 4, liked_user_id: 2, created_at: "2024-03-05T15:00:00Z" },
					{ user_id: 5, liked_user_id: 2, created_at: "2024-03-07T18:00:00Z" },
				],
			});

			const likedBy = await UserLike.getUsersWhoLikedUser(2);

			expect(likedBy).toHaveLength(2);
			expect(likedBy[0]).toBeInstanceOf(UserLike);
			expect(likedBy[1]).toBeInstanceOf(UserLike);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_likes WHERE liked_user_id = $1", [2]);
		});

		it("should return an empty array if no likes are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const likedBy = await UserLike.getUsersWhoLikedUser(99);
			expect(likedBy).toEqual([]);
		});
	});
});