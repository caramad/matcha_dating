const db = require("../backend/config/db");
const Interest = require("../backend/models/interest.model");

jest.mock("../backend/config/db", () => ({
  query: jest.fn(),
}));

describe("Interest Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByName", () => {
    it("should return an Interest instance when interest is found", async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: "Music" }],
      });

      const interest = await Interest.findByName("Music");

      expect(interest).toBeInstanceOf(Interest);
      expect(interest.id).toBe(1);
      expect(interest.name).toBe("Music");
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM interests WHERE name = $1",
        ["Music"]
      );
    });

    it("should return null if interest is not found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const interest = await Interest.findByName("Unknown");

      expect(interest).toBeNull();
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM interests WHERE name = $1",
        ["Unknown"]
      );
    });
  });

  describe("create", () => {
    it("should insert and return a new Interest instance", async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 2, name: "Sports" }],
      });

      const newInterest = await Interest.create("Sports");

      expect(newInterest).toBeInstanceOf(Interest);
      expect(newInterest.id).toBe(2);
      expect(newInterest.name).toBe("Sports");
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO interests (name) VALUES ($1) RETURNING *",
        ["Sports"]
      );
    });
  });

  describe("update", () => {
    it("should update an existing interest", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const interest = new Interest(3, "Old Name");
      interest.name = "New Name";

      await interest.update();

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE interests SET name = $1 WHERE id = $2",
        ["New Name", 3]
      );
    });
  });

  describe("delete", () => {
    it("should delete an interest", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const interest = new Interest(4, "To Delete");

      await interest.delete();

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM interests WHERE id = $1",
        [4]
      );
    });
  });
});
