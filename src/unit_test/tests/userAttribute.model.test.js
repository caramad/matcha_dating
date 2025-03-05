const db = require("../backend/config/db");
const UserAttribute = require("../backend/models/userAttribute.model");

jest.mock("../backend/config/db", () => ({
  query: jest.fn(),
}));

describe("UserAttribute Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByUserId", () => {
    it("should return an array of UserAttribute instances when attributes are found", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { user_id: 1, attribute_key: "color", attribute_value: "blue" },
          { user_id: 1, attribute_key: "size", attribute_value: "large" },
        ],
      });

      const attributes = await UserAttribute.findByUserId(1);

      expect(attributes).toHaveLength(2);
      expect(attributes[0]).toBeInstanceOf(UserAttribute);
      expect(attributes[1]).toBeInstanceOf(UserAttribute);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_attributes WHERE user_id = $1",
        [1]
      );
    });

    it("should return an empty array when no attributes are found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const attributes = await UserAttribute.findByUserId(2);
      expect(attributes).toEqual([]);
    });
  });

  describe("create", () => {
    it("should insert and return a new UserAttribute instance", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      const attribute = await UserAttribute.create(1, "theme", "dark");

      expect(attribute).toBeInstanceOf(UserAttribute);
      expect(attribute.user_id).toBe(1);
      expect(attribute.attribute_key).toBe("theme");
      expect(attribute.attribute_value).toBe("dark");
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO user_attributes (user_id, attribute_key, attribute_value) VALUES ($1, $2, $3)",
        [1, "theme", "dark"]
      );
    });
  });

  describe("update", () => {
    it("should update an existing user attribute", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      await UserAttribute.update(1, "theme", "light");

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE user_attributes SET attribute_value = $1 WHERE user_id = $2 AND attribute_key = $3",
        ["light", 1, "theme"]
      );
    });
  });

  describe("delete", () => {
    it("should delete a user attribute", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });
      await UserAttribute.delete(1, "theme");

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_attributes WHERE user_id = $1 AND attribute_key = $2",
        [1, "theme"]
      );
    });
  });
});
