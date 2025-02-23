const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

SALT_ROUNDS = 10

exports.registerUser = async ({ name, email, password }) => {

	// check empty fields
	if (!name || !email || !password) {
		throw new Error("All fields are required");
	}

	const existingUser = await User.findByEmail(email);
	if (existingUser) {
		throw new Error("User already exists");
	}
	
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = await User.create(name, email, hashedPassword);

	return { id: newUser.id, name: newUser.name, email: newUser.email};
};
