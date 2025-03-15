const authService = require("../backend/services/auth.services");
const User = require("../backend/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../backend/models/user.model");
jest.mock("../backend/config/db", () => ({
    query: jest.fn(),
}));
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mock implementations before each test
    });

    describe("registerUser", () => {
        it("should register a new user successfully", async () => {
            const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };

            User.findByEmail.mockResolvedValue(null); // No existing user
            bcrypt.hash.mockResolvedValue("hashedpassword"); // Mock hashing
            User.create.mockResolvedValue(mockUser); // Mock user creation

            const result = await authService.registerUser({ email: "test@example.com", password: "password123" });

            expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(User.create).toHaveBeenCalledWith("test@example.com", "hashedpassword");
            expect(result).toEqual({ id: 1 });
        });

        it("should throw an error if the user already exists", async () => {
            User.findByEmail.mockResolvedValue({ id: 1, email: "test@example.com" });

            await expect(authService.registerUser({ email: "test@example.com", password: "password123" }))
                .rejects.toThrow("User already exists");

            expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
            expect(User.create).not.toHaveBeenCalled();
        });
    });

    describe("loginUser", () => {
        it("should log in a user with valid credentials", async () => {
            const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
            
            User.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mockToken");

            const result = await authService.loginUser({ email: "test@example.com", password: "password123" });

            expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedpassword");
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, email: "test@example.com" },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            expect(result).toBe("mockToken");
        });

        it("should throw an error if the user does not exist", async () => {
            User.findByEmail.mockResolvedValue(null);

            await expect(authService.loginUser({ email: "notfound@example.com", password: "password123" }))
                .rejects.toThrow("Invalid credentials");

            expect(User.findByEmail).toHaveBeenCalledWith("notfound@example.com");
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it("should throw an error if the password is incorrect", async () => {
            const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };

            User.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.loginUser({ email: "test@example.com", password: "wrongpassword" }))
                .rejects.toThrow("Invalid credentials");

            expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
        });
    });

	/*
	exports.refreshToken = async ({ refreshToken }) => {

	const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
	const user = await User.findById(decoded.id);
	if (!user) {
		throw new Error("Invalid token");
	}

	const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

	return token;
}
	*/

	describe("refreshToken", () => {
		it("should generate a new access token if the refresh token is valid", async () => {
			const mockUser = { id: 1, email: "example@test.com" };

			jwt.verify.mockReturnValue({ id: 1 });
			User.findById.mockResolvedValue(mockUser);
			jwt.sign.mockReturnValue("newAccessToken");

			const result = await authService.refreshToken({ refreshToken: "validToken" });

			expect(jwt.verify).toHaveBeenCalledWith("validToken", process.env.JWT_REFRESH_SECRET);
			expect(User.findById).toHaveBeenCalledWith(1);
			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: 1, email: "example@test.com" },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);
			expect(result).toBe("newAccessToken");
		});
	
		it("should throw an error if the refresh token is invalid", async () => {
			jwt.verify.mockImplementation(() => {
				throw new Error("Invalid token");
			});
	
			await expect(authService.refreshToken({ refreshToken: "invalidToken" }))
				.rejects.toThrow("Invalid token");
	
			expect(jwt.verify).toHaveBeenCalledWith("invalidToken", process.env.JWT_REFRESH_SECRET);
			expect(jwt.sign).not.toHaveBeenCalled();
		});
	
		it("should throw an error if the refresh token is expired", async () => {
			jwt.verify.mockImplementation(() => {
				throw new Error("jwt expired");
			});
	
			await expect(authService.refreshToken({ refreshToken: "expiredToken" }))
				.rejects.toThrow("jwt expired");
	
			expect(jwt.verify).toHaveBeenCalledWith("expiredToken", process.env.JWT_REFRESH_SECRET);
			expect(jwt.sign).not.toHaveBeenCalled();
		});
	});
	

});
