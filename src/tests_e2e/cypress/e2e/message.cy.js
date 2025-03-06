const jwt = require('jsonwebtoken');

describe('Messages API', () => {
    const apiUrl = '/api/messages';

    let authToken1, authToken2;
    let user1 = { email: 'alice@example.com', password: 'Password123!' };
    let user2 = { email: 'bob@example.com', password: 'Password123!' };
    let userId1, userId2;  // Store actual integer IDs

    /** Helper functions **/
    const registerUser = (user) => {
        return cy.request('POST', '/api/auth/register', { email: user.email, password: user.password });
    };

    const loginUser = (user) => {
        return cy.request('POST', '/api/auth/login', { email: user.email, password: user.password });
    };

    const deleteUser = (email) => {
        return cy.task('queryDb', `DELETE FROM users WHERE email = '${email}';`);
    };

	const deleteAllMessages = () => {
		return cy.task('queryDb', 'DELETE FROM messages');
	}

	const saveMessage = (senderId, receiverId, message) => {
		return cy.request({
			method: 'POST',
			url: apiUrl + '/' + receiverId,
			headers: { Authorization: `Bearer ${authToken1}` },
			body: {
				message: message
			}
		});
	}

    before(() => {
		cy.wrap(null)
		.then(() => registerUser(user1))
		.then(() => registerUser(user2))
		.then(() => loginUser(user1))
		.then((response) => {
			authToken1 = response.body.token;
			userId1 = jwt.decode(authToken1).id
		})
		.then(() => loginUser(user2))
		.then((response) => {
			authToken2 = response.body.token;
			userId2 = jwt.decode(authToken2).id
		});
		deleteAllMessages();
    });

    after(() => {
        deleteUser(user1.email);
        deleteUser(user2.email);
		deleteAllMessages();
    });

    it('should save a message', () => {
        cy.wrap(null).then(() => {
            cy.request({
                method: 'POST',
                url: apiUrl + '/' + userId2,
                headers: { Authorization: `Bearer ${authToken1}` },
                body: {
                    message: 'Hello, Bob!'
                }
            }).then((response) => {
                expect(response.status).to.eq(201);

                // Verify in database
                cy.task('queryDb', `SELECT * FROM messages WHERE sender_id=${userId1} AND receiver_id=${userId2} AND content='Hello, Bob!'`)
                    .then((result) => {
                        expect(result.length).to.eq(1);
                    });
            });
        });
    });

    it('should retrieve messages for a user', () => {
		// save a message first
		saveMessage(userId1, userId2, 'Hello, Bob!').then(() => {
			cy.request({
				method: 'GET',
				url: apiUrl,
				headers: { Authorization: `Bearer ${authToken1}` }
			}).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body.messages).to.be.an('array');
			
				cy.task('queryDb', `SELECT * FROM messages WHERE sender_id=${userId1} OR receiver_id=${userId1}`)
					.then((result) => {
						expect(result.length).to.eq(response.body.messages.length);
					});
			});
		});
    });

    it('should retrieve messages between two users', () => {
		// save a message first
		saveMessage(userId1, userId2, 'Hello, Bob!').then(() => {
			cy.request({
				method: 'GET',
				url: `${apiUrl}/${userId2}`,
				headers: { Authorization: `Bearer ${authToken1}` }
			}).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body.messages).to.be.an('array');

				cy.task('queryDb', `SELECT * FROM messages WHERE sender_id=${userId1} AND receiver_id=${userId2}`)
					.then((result) => {
						expect(result.length).to.eq(response.body.messages.length);
					});
			});
		});
    });
});
