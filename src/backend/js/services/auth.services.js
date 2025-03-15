const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

SALT_ROUNDS = 10

exports.registerUser = async ({ email, password }) => {

	const existingUser = await User.findByEmail(email);
	if (existingUser) {
		throw new Error("User already exists");
	}
	
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const newUser = await User.create(email, hashedPassword);

	return { id: newUser.id };
};

exports.loginUser = async ({ email, password }) => {

	const user = await User.findByEmail(email);
	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

	return token
}

exports.refreshToken = async ({ refreshToken }) => {

	const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
	const user = await User.findById(decoded.id);
	if (!user) {
		throw new Error("Invalid token");
	}

	const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

	return token;
}