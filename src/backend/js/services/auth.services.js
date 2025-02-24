const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

SALT_ROUNDS = 10

exports.registerUser = async ({ name, email, password }) => {

	const existingUser = await User.findByEmail(email);
	if (existingUser) {
		throw new Error("User already exists");
	}
	
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const newUser = await User.create(name, email, hashedPassword);

	return { id: newUser.id, name: newUser.name, email: newUser.email};
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