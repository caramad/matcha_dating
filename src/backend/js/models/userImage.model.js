const db = require("../config/db");

/**
 * Represents an image associated with a user.
 * @class
 * @property {number} id - The ID of the image.
 * @property {number} userId - The ID of the user the image belongs to.
 * @property {string} imagePath - The path of the image.
 * @property {number} position - The position/order of the image.
 * @method findImagesByUserId - Fetches images for a specified user ordered by position.
 * @method addImage - Adds a new image for the user.
 * @method updateImage - Updates an existing image's path or position.
 * @method deleteImage - Deletes an image from the user's collection.
 * @returns {UserImage}
 * @requires db
 */
class UserImage {
    constructor(id, userId, imagePath, position) {
        this.id = id;
        this.userId = userId;
        this.imagePath = imagePath;
        this.position = position;
    }

    /**
     * Returns images for a specified user ordered by position.
     * @param {number} userId - The ID of the user whose images are to be fetched.
     * @returns {Array<UserImage>} - List of images associated with the user.
     */
    static async findImagesByUserId(userId) {
        const { rows } = await db.query(
            `SELECT id, user_id, image_path, position 
            FROM user_images
            WHERE user_id = $1
            ORDER BY position ASC`,
            [userId]
        );

        return rows.map(row => new UserImage(
            row.id,
            row.user_id,
            row.image_path,
            row.position
        ));
    }

    /**
     * Adds a new image for the user.
     * @param {number} userId - The ID of the user to add the image for.
     * @param {string} imagePath - The path of the image to be added.
     * @param {number} position - The position/order of the image.
     * @returns {UserImage} - The newly created UserImage object.
     */
    static async addImage(userId, imagePath, position) {
        const { rows } = await db.query(
            `INSERT INTO user_images (user_id, image_path, position) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [userId, imagePath, position]
        );

        return new UserImage(
            rows[0].id,
            rows[0].user_id,
            rows[0].image_path,
            rows[0].position
        );
    }

    /**
     * Updates an existing image's path or position.
     * @param {number} imageId - The ID of the image to be updated.
     * @param {string} newImagePath - The new image path.
     * @param {number} newPosition - The new position for the image.
     */
    static async updateImage(imageId, newImagePath, newPosition) {
        await db.query(
            `UPDATE user_images 
            SET image_path = $1, position = $2 
            WHERE id = $3`,
            [newImagePath, newPosition, imageId]
        );
    }

    /**
     * Deletes an image from the user's collection.
     * @param {number} imageId - The ID of the image to delete.
     */
    static async deleteImage(imageId) {
        await db.query(
            `DELETE FROM user_images WHERE id = $1`,
            [imageId]
        );
    }
}

module.exports = { UserImage };
