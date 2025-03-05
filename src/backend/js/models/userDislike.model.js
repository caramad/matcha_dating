const db = require("../config/db");

class UserDislike {
  constructor(user_id, disliked_user_id, created_at) {
    this.user_id = user_id;
    this.disliked_user_id = disliked_user_id;
    this.created_at = created_at;
  }

  static async dislikeUser(user_id, disliked_user_id) {
    const { rows } = await db.query(
      "INSERT INTO user_dislikes (user_id, disliked_user_id) VALUES ($1, $2) RETURNING *",
      [user_id, disliked_user_id]
    );
    return new UserDislike(rows[0].user_id, rows[0].disliked_user_id, rows[0].created_at);
  }

  static async removeDislike(user_id, disliked_user_id) {
    await db.query(
      "DELETE FROM user_dislikes WHERE user_id = $1 AND disliked_user_id = $2",
      [user_id, disliked_user_id]
    );
  }

  static async getDislikesByUser(user_id) {
    const { rows } = await db.query(
      "SELECT * FROM user_dislikes WHERE user_id = $1",
      [user_id]
    );
    return rows.map(row => new UserDislike(row.user_id, row.disliked_user_id, row.created_at));
  }

  static async getUsersWhoDisliked(disliked_user_id) {
    const { rows } = await db.query(
      "SELECT * FROM user_dislikes WHERE disliked_user_id = $1",
      [disliked_user_id]
    );
    return rows.map(row => new UserDislike(row.user_id, row.disliked_user_id, row.created_at));
  }
}

module.exports = UserDislike;
