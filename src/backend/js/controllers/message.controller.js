const MessageService = require("../services/message.services");

exports.saveMessage = async (req, res, next) => {
	try {
		const senderId = req.user.id;
		const receiverId = req.params.receiverId;
		const content = req.body.message;
		console.log('senderId: ', senderId);
		console.log('receiverId: ', receiverId);
		console.log('content: ', content);

		const message = await MessageService.saveMessage(senderId, receiverId, content);
		res.status(201).json({ message });
	} catch (error) {
		error.status = 400;
		next(error);
	}
};

exports.getUserMessages = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const messages = await MessageService.getUserMessages(userId);
		res.status(200).json({ messages });
	} catch (error) {
		error.status = 400;
		next(error);
	}
};

exports.getMessagesBetweenUsers = async (req, res, next) => {
	try {
		const userId1 = req.user.id;
		const userId2 = req.params.receiverId;

		const messages = await MessageService.getMessagesBetweenUsers(userId1, userId2);
		res.status(200).json({ messages });
	} catch (error) {
		error.status = 400;
		next(error);
	}
};
