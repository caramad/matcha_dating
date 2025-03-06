const Message = require("../models/message.model");

/**
 * Handles message-related business logic without directly dealing with the database.
 */
class MessageService {
    
    /**
     * Saves a message using the Message model.
     * @param {number} senderId - The ID of the sender.
     * @param {number} receiverId - The ID of the receiver.
     * @param {string} message - The message content.
     * @returns {Promise<Message>} - The saved message object.
     */
    static async saveMessage(senderId, receiverId, message) {
        try {
            return await Message.create(senderId, receiverId, message);
        } catch (error) {
            console.error("Error saving message:", error);
            throw new Error("Failed to save message.");
        }
    }

    /**
     * Retrieves all messages for a specific user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<Message[]>} - An array of messages.
     */
    static async getUserMessages(userId) {
        try {
            return await Message.getMessagesByUser(userId);
        } catch (error) {
            console.error("Error retrieving messages:", error);
            throw new Error("Failed to retrieve messages.");
        }
    }

    /**
     * Retrieves messages exchanged between two users.
     * @param {number} userId1 - First user's ID.
     * @param {number} userId2 - Second user's ID.
     * @returns {Promise<Message[]>} - An array of messages exchanged.
     */
    static async getMessagesBetweenUsers(userId1, userId2) {
        try {
            return await Message.getMessagesBetweenUsers(userId1, userId2);
        } catch (error) {
            console.error("Error retrieving conversation:", error);
            throw new Error("Failed to retrieve conversation.");
        }
    }
}

module.exports = MessageService;
