const db = require("../backend/config/db");
const UserInterest = require("../backend/models/userInterest.model");

jest.mock("../backend/config/db", () => ({
  query: jest.fn(),
}));

describe("UserInterest Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByUserId", () => {
    it("should return an array of UserInterest instances for a given user", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { user_id: 1, interest_id: 10 },
          { user_id: 1, interest_id: 20 },
        ],
      });

      const interests = await UserInterest.findByUserId(1);

      expect(interests).toHaveLength(2);
      expect(interests[0]).toBeInstanceOf(UserInterest);
      expect(interests[0].userId).toBe(1);
      expect(interests[0].interestId).toBe(10);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_interests WHERE user_id = $1",
        [1]
      );
    });
  });

  describe("findByInterestId", () => {
    it("should return an array of UserInterest instances for a given interest", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { user_id: 2, interest_id: 10 },
          { user_id: 3, interest_id: 10 },
        ],
      });

      const users = await UserInterest.findByInterestId(10);

      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(UserInterest);
      expect(users[0].interestId).toBe(10);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_interests WHERE interest_id = $1",
        [10]
      );
    });
  });

  describe("getUsersWithInterests", () => {
    it("should return an array of user IDs with specified interests", async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ user_id: 4 }, { user_id: 5 }],
      });

      const userIds = await UserInterest.getUsersWithInterests([
        { id: 10 },
        { id: 20 },
      ]);

      expect(userIds).toEqual([4, 5]);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT user_id FROM user_interests WHERE interest_id IN ($1, $2)",
        [10, 20]
      );
    });
  });

  describe("addInterest", () => {
    it("should insert a new user interest", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const userInterest = await UserInterest.addInterest(6, 30);

      expect(userInterest).toBeInstanceOf(UserInterest);
      expect(userInterest.userId).toBe(6);
      expect(userInterest.interestId).toBe(30);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)",
        [6, 30]
      );
    });
  });

  describe("removeInterest", () => {
    it("should remove a user interest", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      await UserInterest.removeInterest(7, 40);

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2",
        [7, 40]
      );
    });
  });
});