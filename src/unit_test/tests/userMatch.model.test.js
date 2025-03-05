const db = require("../backend/config/db");
const UserMatch = require("../backend/models/userMatch.model");

jest.mock("../backend/config/db", () => ({
	query: jest.fn(),
}));

describe("UserMatch Model", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("createMatch", () => {
		it("should insert and return a new UserMatch instance", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user_id: 1, matched_user_id: 2, created_at: "2024-03-05T12:00:00Z" }],
			});

			const match = await UserMatch.createMatch(1, 2);

			expect(match).toBeInstanceOf(UserMatch);
			expect(match.user_id).toBe(1);
			expect(match.matched_user_id).toBe(2);
			expect(match.created_at).toBe("2024-03-05T12:00:00Z");
			expect(db.query).toHaveBeenCalledWith(
				"INSERT INTO user_matches (user_id, matched_user_id) VALUES ($1, $2) RETURNING *",
				[1, 2]
			);
		});
	});

	describe("deleteMatch", () => {
		it("should delete a user match", async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			await UserMatch.deleteMatch(1, 2);

			expect(db.query).toHaveBeenCalledWith(
				"DELETE FROM user_matches WHERE user_id = $1 AND matched_user_id = $2",
				[1, 2]
			);
		});
	});

	describe("getUserMatches", () => {
		it("should return an array of UserMatch instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 1, matched_user_id: 2, created_at: "2024-03-05T12:00:00Z" },
					{ user_id: 1, matched_user_id: 3, created_at: "2024-03-06T14:00:00Z" },
				],
			});

			const matches = await UserMatch.getUserMatches(1);

			expect(matches).toHaveLength(2);
			expect(matches[0]).toBeInstanceOf(UserMatch);
			expect(matches[1]).toBeInstanceOf(UserMatch);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_matches WHERE user_id = $1", [1]);
		});

		it("should return an empty array if no matches are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const matches = await UserMatch.getUserMatches(99);
			expect(matches).toEqual([]);
		});
	});

	describe("getMatchesWithUser", () => {
		it("should return an array of UserMatch instances", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 4, matched_user_id: 2, created_at: "2024-03-05T15:00:00Z" },
					{ user_id: 5, matched_user_id: 2, created_at: "2024-03-07T18:00:00Z" },
				],
			});

			const matchedBy = await UserMatch.getMatchesWithUser(2);

			expect(matchedBy).toHaveLength(2);
			expect(matchedBy[0]).toBeInstanceOf(UserMatch);
			expect(matchedBy[1]).toBeInstanceOf(UserMatch);
			expect(db.query).toHaveBeenCalledWith("SELECT * FROM user_matches WHERE matched_user_id = $1", [2]);
		});

		it("should return an empty array if no matches are found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const matchedBy = await UserMatch.getMatchesWithUser(99);
			expect(matchedBy).toEqual([]);
		});
	});
});