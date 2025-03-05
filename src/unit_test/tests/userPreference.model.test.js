// userPreference.model.test.js

const db = require("../backend/config/db");
const UserPreference = require("../backend/models/userPreference.model");

jest.mock("../backend/config/db", () => ({
  query: jest.fn(),
}));

// Helper function to normalize whitespace in SQL queries
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

describe("UserPreference Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByUserId", () => {
    it("should return a UserPreference instance when the user preference is found", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            user_id: 42,
            preferred_gender: "Female",
            min_age: 25,
            max_age: 35,
            location_radius: 10,
          },
        ],
      });

      const userPreference = await UserPreference.findByUserId(42);

      expect(userPreference).toBeInstanceOf(UserPreference);
      expect(userPreference.userId).toBe(42);
      expect(userPreference.preferredGender).toBe("Female");
      expect(userPreference.minAge).toBe(25);
      expect(userPreference.maxAge).toBe(35);
      expect(userPreference.locationRadius).toBe(10);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_preferences WHERE user_id = $1",
        [42]
      );
    });

    it("should return null when no user preference is found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const userPreference = await UserPreference.findByUserId(999);

      expect(userPreference).toBeNull();
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_preferences WHERE user_id = $1",
        [999]
      );
    });
  });

  describe("create", () => {
    it("should insert and return a new UserPreference instance", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            user_id: 99,
            preferred_gender: "Male",
            min_age: 18,
            max_age: 30,
            location_radius: 50,
          },
        ],
      });

      const newUserPreference = await UserPreference.create(
        99,
        "Male",
        18,
        30,
        50
      );

      expect(newUserPreference).toBeInstanceOf(UserPreference);
      expect(newUserPreference.userId).toBe(99);
      expect(newUserPreference.preferredGender).toBe("Male");
      expect(newUserPreference.minAge).toBe(18);
      expect(newUserPreference.maxAge).toBe(30);
      expect(newUserPreference.locationRadius).toBe(50);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO user_preferences (user_id, preferred_gender, min_age, max_age, location_radius) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [99, "Male", 18, 30, 50]
      );
    });
  });

  describe("update", () => {
    it("should update an existing user preference", async () => {
      // Create an instance to update
      const userPreference = new UserPreference(10, "Female", 20, 40, 15);

      // Mock the db response
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      await userPreference.update();

      // Grab the actual SQL string passed to db.query
      const actualQuery = db.query.mock.calls[0][0];

      // Our expected query string
      const expectedQuery = `
        UPDATE user_preferences
                SET preferred_gender = $1,
                    min_age = $2,
                    max_age = $3,
                    location_radius = $4
                WHERE user_id = $5
      `;

      // Compare after normalizing whitespace
      expect(normalizeWhitespace(actualQuery)).toBe(
        normalizeWhitespace(expectedQuery)
      );

      // Also verify the parameters
      const actualParams = db.query.mock.calls[0][1];
      expect(actualParams).toEqual(["Female", 20, 40, 15, 10]);
    });
  });

  describe("delete", () => {
    it("should delete a user preference", async () => {
      const userPreference = new UserPreference(123, "Male", 25, 50, 20);

      db.query.mockResolvedValueOnce({ rowCount: 1 });

      await userPreference.delete();

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_preferences WHERE user_id = $1",
        [123]
      );
    });
  });

  describe("findByAttributes", () => {
    it("should return a matching user preference when one is found", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            user_id: 11,
            preferred_gender: "Female",
            min_age: 25,
            max_age: 35,
            location_radius: 5,
          },
        ],
      });

      const result = await UserPreference.findByAttributes(
        "Female",
        25,
        35,
        5
      );

      expect(result).toBeInstanceOf(UserPreference);
      expect(result.userId).toBe(11);
      expect(result.preferredGender).toBe("Female");
      expect(result.minAge).toBe(25);
      expect(result.maxAge).toBe(35);
      expect(result.locationRadius).toBe(5);
      expect(db.query).toHaveBeenCalled();
    });

    it("should return null if no matching preferences are found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const result = await UserPreference.findByAttributes(
        "Male",
        18,
        25,
        10
      );

      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalled();
    });

	it("should return a matching user preference when one is found", async () => {
		db.query.mockResolvedValueOnce({
		rows: [
			{
			user_id: 11,
			preferred_gender: "Female",
			min_age: 25,
			max_age: 35,
			location_radius: 5,
			},
		],
		});
	
		const result = await UserPreference.findByAttributes(
		"Female",
		25,
		35,
		5
		);
	
		expect(result).toBeInstanceOf(UserPreference);
		expect(result.userId).toBe(11);
		expect(result.preferredGender).toBe("Female");
		expect(result.minAge).toBe(25);
		expect(result.maxAge).toBe(35);
		expect(result.locationRadius).toBe(5);
		expect(db.query).toHaveBeenCalled();
	});
	
	it("should return null if no matching preferences are found", async () => {
		db.query.mockResolvedValueOnce({ rows: [] });
	
		const result = await UserPreference.findByAttributes(
		"Male",
		18,
		25,
		10
		);
	
		expect(result).toBeNull();
		expect(db.query).toHaveBeenCalled();
	});
	
	it("should work when some attributes are null", async () => {
		db.query.mockResolvedValueOnce({
		rows: [
			{
			user_id: 12,
			preferred_gender: "Other",
			min_age: 20,
			max_age: 40,
			location_radius: 10,
			},
		],
		});
	
		const result = await UserPreference.findByAttributes(null, 20, 40, null);
	
		expect(result).toBeInstanceOf(UserPreference);
		expect(result.preferredGender).toBe("Other");
		expect(result.minAge).toBe(20);
		expect(result.maxAge).toBe(40);
		expect(result.locationRadius).toBe(10);
		expect(db.query).toHaveBeenCalled();
	});
	
	it("should return null if no criteria match", async () => {
		db.query.mockResolvedValueOnce({ rows: [] });
	
		const result = await UserPreference.findByAttributes(null, null, null, null);
	
		expect(result).toBeNull();
		expect(db.query).toHaveBeenCalled();
	});
  });
});
