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

	before(() => {
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

		// assert that userId* and token* were created and user ids are integers
		// log in cypress console
		cy.log(`User 1: ${user1.email} (ID: ${userId1})`);
		cy.log(`User 2: ${user2.email} (ID: ${userId2})`);
		cy.log(`Token 1: ${token1}`);
		cy.log(`Token 2: ${token2}`);


	});

	// Clean up the sockets after tests
	after(() => {
		if (clientSocket1) clientSocket1.close();
		if (clientSocket2) clientSocket2.close();
		cy.task("queryDb", `DELETE FROM users`);
	});

	// --- Test #1: Client 1 registration, login, connect ---
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

	// --- Test #2: Client 2 can send a message to Client 1 ---
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
	
		// Once client 2 connects, have it "join", then send a message
		clientSocket2.on("connect", () => {
			// Example: your server expects "join" with a userId
			clientSocket2.emit("join", userId2);
	
			// send a chat message
			setTimeout(() => {
				clientSocket2.emit("sendMessage", {
					receiverId: userId1,
					message: `Hello from ${userId2}!`,
				});
			}, 500);
		});
	
		// Add a connect_error handler to see if the handshake was rejected
		clientSocket2.on("connect_error", (err) => {
			done(err || new Error("connect_error without error object"));
		});
	
		// 5s fallback
		setTimeout(() => {
			done(new Error("Message was never received by Client 1"));
		}, 5000);
	});
});

