const AuthService = require("../services/auth.service");

exports.register = async (req, res) => {
	try {
		const user = await AuthService.registerUser(req.body);
		res.status(201).json({ success: true, user});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const token = await AuthService.loginUser(req.body);
		res.status(200).json({ success: true, token});
	} catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};