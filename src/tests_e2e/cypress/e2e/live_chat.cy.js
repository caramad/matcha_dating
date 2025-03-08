/**
 * @file message.cy.js
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

	// We’ll generate two unique user credentials
	const user1 = { email: randomEmail(), password: "password123" };
	const user2 = { email: randomEmail(), password: "password123" };

	// If your e2e container sees the server as http://nginx, use that base
	// Adjust if you use a different service name in docker-compose.
	const BASE_URL = "http://nginx:80";

	// --- Utilities ---
	function registerAndLogin(user) {
		// Return a promise that yields { token: '...' }
		return cy
			.request("POST", `${BASE_URL}/api/auth/register`, user)
			.then(() => cy.request("POST", `${BASE_URL}/api/auth/login`, user))
			.then((resp) => {
				expect(resp.status).to.equal(200);
				expect(resp.body).to.have.property("token");
				return { token: resp.body.token };
			});
	}

	// Socket.io connect that returns the socket instance
	function connectSocket(token) {
		// With Cypress, we'll do raw JavaScript for the socket.
		// Keep a reference so we can .close() in after() if needed.
		const socket = io(`${BASE_URL}`, {
			path: "/socket.io/",
			transports: ["websocket"],
			auth: { token },
		});

		return socket;
	}

	beforeEach(() => {
		// register user1 and login both users
		cy.task("queryDb", `DELETE FROM users`);

		// register user1
		registerAndLogin(user1).then(({ token }) => {
			token1 = token;
			userId1 = jsonwebtoken.decode(token).id;
		});

		// register user2
		registerAndLogin(user2).then(({ token }) => {
			token2 = token;
			userId2 = jsonwebtoken.decode(token).id;
		});
	});

	// Clean up the sockets after tests
	afterEach(() => {
		if (clientSocket1) clientSocket1.close();
		if (clientSocket2) clientSocket2.close();
		cy.task("queryDb", `DELETE FROM users`);
	});

	it("Client 1 registers, logs in, and connects to Socket.io", function (done) {
		this.timeout(10000); // allow up to 10s

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
	
		// Client 1 listens for "receiveMessage"
		clientSocket1.on("receiveMessage", (msg) => {
			try {
				expect(msg).to.have.property("content", `Hello from ${userId2}!`);
				done(); // success!
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			expect(clientSocket1.connected).to.be.true;
			clientSocket1.emit("join", userId1);
		});
	
		clientSocket2.on("connect", () => {
			clientSocket2.emit("join", userId2);
	
			// send a chat message
			setTimeout(() => {
				clientSocket2.emit("sendMessage", {
					receiverId: userId1,
					message: `Hello from ${userId2}!`,
				});
			}, 500);
		});
	
		clientSocket2.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	
		setTimeout(() => {
			done(new Error("Message was never received by Client 1"));
		}, 5000);
	});

	it("Client 2 sends another message to Client 1", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);
		clientSocket2 = connectSocket(token2);
	
		// Client 1 listens for "receiveMessage"
		clientSocket1.on("receiveMessage", (msg) => {
			try {
				expect(msg).to.have.property("content", `Hello again from ${userId2}!`);
				done(); // success!
			} catch (err) {
				done(err);
			}
		});

		clientSocket1.on("connect", () => {
			expect(clientSocket1.connected).to.be.true;
			clientSocket1.emit("join", userId1);
		});
	
		clientSocket2.on("connect", () => {
			clientSocket2.emit("join", userId2);
	
			// send a chat message
			setTimeout(() => {
				clientSocket2.emit("sendMessage", {
					receiverId: userId1,
					message: `Hello again from ${userId2}!`,
				});
			}, 500);
		});
	
		clientSocket2.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	
		setTimeout(() => {
			done(new Error("Message was never received by Client 1"));
		}, 5000);
	});

	it("Client 2 sends a message to a non-existent user", function (done) {
		this.timeout(10000);

		clientSocket2 = connectSocket(token2);
	
		clientSocket2.on("connect", () => {
			expect(clientSocket2.connected).to.be.true;
			clientSocket2.emit("join", userId2);
	
			// send a chat message
			setTimeout(() => {
				clientSocket2.emit("sendMessage", {
					receiverId: 9999999,
					message: `Hello from ${userId2}!`,
				});
			}, 500);
		});
	
		// Client should receive an "error" message
		clientSocket2.on("error", (err) => {
			expect(err).to.equal("Message failed to send");
			clientSocket2.close();
			done();
		});
	});

	it("Clients send messages to each other", function (done) {
		this.timeout(10000);

		clientSocket1 = connectSocket(token1);
		clientSocket2 = connectSocket(token2);
	
		// Client 1 listens for "receiveMessage"
		clientSocket1.on("receiveMessage", (msg) => {
			try {
				expect(msg).to.have.property("content", `Hello from ${userId2}!`);
				done(); // success!
			} catch (err) {
				done(err);
			}
		});

		clientSocket2.on("connect", () => {
			clientSocket2.emit("join", userId2);
	
			// send a chat message
			setTimeout(() => {
				clientSocket2.emit("sendMessage", {
					receiverId: userId1,
					message: `Hello from ${userId2}!`,
				});
			}, 500);
		});
	
		clientSocket2.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	
		clientSocket1.on("connect", () => {
			expect(clientSocket1.connected).to.be.true;
			clientSocket1.emit("join", userId1);
		});
	
		clientSocket1.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	
		setTimeout(() => {
			done(new Error("Message was never received by Client 1"));
		}, 5000);
	});

	// --- Client cannot send a message to itself ---
	it("Client should not send a message to itself", function (done) {
		this.timeout(10000);
	
		clientSocket1 = connectSocket(token1);
	
		clientSocket1.on("connect", () => {
			expect(clientSocket1.connected).to.be.true;
			clientSocket1.emit("join", userId1);
	
			// Send a message to itself
			clientSocket1.emit("sendMessage", {
				receiverId: userId1,
				message: "Hello from myself",
			});
		});

		// Client should receive an "error" message
		clientSocket1.on("error", (err) => {
			expect(err).to.equal("Message failed to send");
			clientSocket1.close();
			done();
		});
	});
	

});

