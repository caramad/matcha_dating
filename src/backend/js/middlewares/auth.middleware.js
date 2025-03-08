const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const MIN_PASSWORD_SIZE = 8;
const MAX_EMAIL_SIZE = 50;
const MAX_PASSWORD_SIZE = 50;

// Auth middleware to check if user is authenticated
const validUserTokenHttp = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied: No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
		console.log("error: ", error);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

const validUserTokenWs = (socket, next) => {
	const token = socket.handshake.auth.token;
	
	if (!token) {
		return next(new Error('Access Denied: No token provided'));
	}
	
	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		socket.user = decoded; // Attach user info to socket
		console.log("socket.user: ", socket.user);
		next();
	} catch (error) {
		return next(new Error('Invalid or expired token'));
	}
}

const validateRegister = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: MAX_EMAIL_SIZE }).withMessage(`Email must be at most ${MAX_EMAIL_SIZE} characters`),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isString()
        .isLength({ min: MIN_PASSWORD_SIZE, max: MAX_PASSWORD_SIZE })
        .withMessage(`Password must be between ${MIN_PASSWORD_SIZE} and ${MAX_PASSWORD_SIZE} characters`),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = { validUserTokenHttp, validUserTokenWs, validateRegister,  validateLogin };