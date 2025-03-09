/**
 * @file live_chat.cy.js
 * Cypress E2E test that connects to an *already running* Socket.io endpoint via Nginx,
 * but now with user registration + login to get a JWT token for Socket.IO auth.
 */

const io = require("socket.io-client");
const jsonwebtoken = require("jsonwebtoken");

function randomEmail() {
	return `${Math.random().toString(36).substring(7)}@example.com`;
}

describe("WebSocket E2E via external server endpoint", () => {
	let clientSocket1;
	let clientSocket2;

	let userId1;
	let userId2;

	let token1;
	let token2;

	const user1 = { email: randomEmail(), password: "password123" };
	const user2 = { email: randomEmail(), password: "password123" };

	const BASE_URL = "http://nginx:80";

	function registerAndLogin(user) {
		return cy
			.request("POST", `${BASE_URL}/api/auth/register`, user)
			.then(() => cy.request("POST", `${BASE_URL}/api/auth/login`, user))
			.then((resp) => {
				expect(resp.status).to.equal(200);
				expect(resp.body).to.have.property("token");
				return { token: resp.body.token };
			});
	}

	function connectSocket(token) {
		return io(`${BASE_URL}`, {
			path: "/socket.io/",
			transports: ["websocket"],
			auth: { token },
		});
	}

	beforeEach(() => {
		cy.task("queryDb", `DELETE FROM users`);

		registerAndLogin(user1).then(({ token }) => {
			token1 = token;
			userId1 = jsonwebtoken.decode(token).id;
		});

		registerAndLogin(user2).then(({ token }) => {
			token2 = token;
			userId2 = jsonwebtoken.decode(token).id;
		});
	});

	afterEach(() => {
		if (clientSocket1) clientSocket1.close();
		if (clientSocket2) clientSocket2.close();
		cy.task("queryDb", `DELETE FROM users`);
	});

	it("Client 1 registers, logs in, and connects to Socket.io", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("connect", () => {
			expect(clientSocket1.connected).to.be.true;
			done();
		});

		clientSocket1.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	});

	it("Client 2 registers, logs in, connects, and sends message to Client 1", function (done) {
		this.timeout(10000);
	
		clientSocket1 = connectSocket(token1);
		clientSocket2 = connectSocket(token2);
	
		let messageReceived = false;
		let messageAcknowledged = false;
	
		function checkDone() {
			if (messageReceived && messageAcknowledged) {
				done();
			}
		}
	
		clientSocket1.on("receiveMessage", (msg) => {
			try {
				expect(msg).to.have.property("content", `Hello from ${userId2}!`);
				messageReceived = true;
				checkDone();
			} catch (err) {
				done(err);
			}
		});
	
		clientSocket1.on("connect", () => clientSocket1.emit("join", userId1));
		
		clientSocket2.on("connect", () => {
			clientSocket2.emit("join", userId2);
			setTimeout(() => {
				clientSocket2.emit(
					"sendMessage",
					{ receiverId: userId1, message: `Hello from ${userId2}!` },
					(response) => {
						try {
							expect(response).to.have.property("message");
							messageAcknowledged = true;
							checkDone();
						} catch (err) {
							done(err);
						}
					}
				);
			}, 500);
		});
	});
	

	it("Client 2 sends a message to a non-existent user", function (done) {
		this.timeout(10000);

		clientSocket2 = connectSocket(token2);

		clientSocket2.on("error", (error) => {
			try {
				console.log("Error received:", error);
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Failed to send message.");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket2.on("connect", () => {
			clientSocket2.emit("join", userId2);
			setTimeout(() => {
				clientSocket2.emit("sendMessage", { receiverId: 9999999, message: `Hello from ${userId2}!` });
			}, 500);
		});
	});

	it("Client should not send a message to itself", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("error", (error) => {
			try {
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Cannot send message to self");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			clientSocket1.emit("join", userId1);
			clientSocket1.emit("sendMessage", { receiverId: userId1, message: "Hello from myself" });
		});
	});

	it("Unauthenticated client should not send a message", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket("invalidtoken");

		clientSocket1.on("connect_error", (err) => {
			try {
				expect(err).to.have.property("message", "Invalid or expired token");
				done();
			} catch (error) {
				done(error);
			}
		});

		clientSocket1.on("connect", () => {
			done(new Error("Unauthenticated client was able to connect"));
		});

		setTimeout(() => {
			done(new Error("Unauthenticated client did not receive a connection error"));
		}, 5000);
	});

	it("Client should not send an empty message", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("error", (error) => {
			try {
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Message is required");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			clientSocket1.emit("join", userId1);
			clientSocket1.emit("sendMessage", { receiverId: userId1, message: "" });
		});
	});

	it("Client should not send a message longer than 500 characters", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("error", (error) => {
			try {
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Message must be between 1 and 500 characters");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			clientSocket1.emit("join", userId1);
			clientSocket1.emit("sendMessage", { receiverId: userId1, message: "a".repeat(501) });
		});
	});

	it("Client should not send a message to a non-integer receiver ID", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("error", (error) => {
			try {
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Receiver ID must be an integer");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			clientSocket1.emit("join", userId1);
			clientSocket1.emit("sendMessage", { receiverId: "invalid", message: "Hello" });
		});
	});

	it("Client should not send a message without a receiver ID", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);

		clientSocket1.on("error", (error) => {
			try {
				expect(error).to.be.an("object");
				expect(error).to.have.property("errors").that.is.an("array").with.length.greaterThan(0);
				expect(error.errors[0]).to.have.property("msg", "Receiver ID is required");
				done();
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			clientSocket1.emit("join", userId1);
			clientSocket1.emit("sendMessage", { message: "Hello" });
		});
	});
});
