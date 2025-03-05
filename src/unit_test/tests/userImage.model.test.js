// userImage.model.test.js

const db = require("../backend/config/db");
const { UserImage } = require("../backend/models/userImage.model");

// Mock the db so no real DB calls are made
jest.mock("../backend/config/db", () => ({
  query: jest.fn(),
}));

// Optional: a helper to collapse extra whitespace if you have multi-line queries 
// (only needed if you're having issues with whitespace in your query strings).
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

describe("UserImage Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findImagesByUserId", () => {
    it("should return an array of UserImage instances when images exist", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { id: 1, user_id: 10, image_path: "path1.jpg", position: 1 },
          { id: 2, user_id: 10, image_path: "path2.jpg", position: 2 },
        ],
      });

      const images = await UserImage.findImagesByUserId(10);

      expect(images).toHaveLength(2);
      expect(images[0]).toBeInstanceOf(UserImage);
      expect(images[0].id).toBe(1);
      expect(images[0].userId).toBe(10);
      expect(images[0].imagePath).toBe("path1.jpg");
      expect(images[0].position).toBe(1);

      expect(images[1]).toBeInstanceOf(UserImage);
      expect(images[1].id).toBe(2);
      expect(images[1].userId).toBe(10);
      expect(images[1].imagePath).toBe("path2.jpg");
      expect(images[1].position).toBe(2);

      expect(db.query).toHaveBeenCalledWith(
        `SELECT id, user_id, image_path, position 
            FROM user_images
            WHERE user_id = $1
            ORDER BY position ASC`,
        [10]
      );
    });

    it("should return an empty array when no images exist for the user", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const images = await UserImage.findImagesByUserId(999);

      expect(images).toEqual([]);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, user_id, image_path, position"),
        [999]
      );
    });
  });

  describe("addImage", () => {
    it("should insert and return a new UserImage", async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 5,
            user_id: 10,
            image_path: "newImage.jpg",
            position: 3,
          },
        ],
      });

      const newImage = await UserImage.addImage(10, "newImage.jpg", 3);

      expect(newImage).toBeInstanceOf(UserImage);
      expect(newImage.id).toBe(5);
      expect(newImage.userId).toBe(10);
      expect(newImage.imagePath).toBe("newImage.jpg");
      expect(newImage.position).toBe(3);

      expect(db.query).toHaveBeenCalledWith(
        `INSERT INTO user_images (user_id, image_path, position) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
        [10, "newImage.jpg", 3]
      );
    });
  });

  describe("updateImage", () => {
    it("should update the specified image's path and position", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 }); // e.g. update success

      await UserImage.updateImage(5, "updatedPath.jpg", 4);

      expect(db.query).toHaveBeenCalledWith(
        `UPDATE user_images 
            SET image_path = $1, position = $2 
            WHERE id = $3`,
        ["updatedPath.jpg", 4, 5]
      );
    });
  });

  describe("deleteImage", () => {
    it("should delete the specified image by ID", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 }); // e.g. delete success

      await UserImage.deleteImage(7);

      expect(db.query).toHaveBeenCalledWith(
        `DELETE FROM user_images WHERE id = $1`,
        [7]
      );
    });
  });
});
