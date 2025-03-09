const { body, validationResult } = require("express-validator");
const errorHandler = require("../middlewares/error.middleware");

const chatMessageValidationRules = [
	body("message")
		.notEmpty().withMessage("Message is required")
		.isString().withMessage("Message must be a string")
		.isLength({ min: 1, max: 500 }).withMessage("Message must be between 1 and 500 characters"),

	body("receiverId")
		.notEmpty().withMessage("Receiver ID is required")
		.isInt().withMessage("Receiver ID must be an integer")
];

const validateChatMessageSocket = async (data, socket) => {
    const mockRequest = { body: data };

    await Promise.all(chatMessageValidationRules.map((validation) => validation.run(mockRequest)));

    const errors = validationResult(mockRequest);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        errorHandler.handleWsError(error, socket);
        throw error;
    }
};

module.exports = { validateChatMessageSocket };



module.exports = { validateChatMessageSocket };
