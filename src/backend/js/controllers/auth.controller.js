const AuthService = require("../services/auth.services");

exports.register = async (req, res, next) => {
	try {
		const user = await AuthService.registerUser(req.body);
		res.status(201).json({ user });
	} catch (error) {
		error.status = 400;
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const token = await AuthService.loginUser(req.body);
		res.status(200).json({ token });
	} catch (error) {
		error.status = 401;
		next(error);
	}
};
