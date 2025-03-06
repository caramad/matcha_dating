
const db = require("../config/db");

class Message {
	constructor(sender_id, receiver_id, content) {
		this.sender_id = sender_id;
		this.receiver_id = receiver_id;
		this.content = content;
	}

	static async create(sender_id, receiver_id, content) {
		await db.query("INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)", [sender_id, receiver_id, content]);
		return new Message(sender_id, receiver_id, content);
	}

	static async getMessagesByUser(user_id) {
		const { rows } = await db.query("SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY sent_at", [user_id]);
		return rows.map(row => new Message(row.sender_id, row.receiver_id, row.content));
	}

	static async getMessagesBetweenUsers(user_id1, user_id2) {
		const { rows } = await db.query("SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY sent_at", [user_id1, user_id2]);
		return rows.map(row => new Message(row.sender_id, row.receiver_id, row.content));
	}
}

module.exports = Message;