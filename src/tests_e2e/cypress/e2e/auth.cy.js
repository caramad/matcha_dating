describe('Backend API Authentication Tests', () => {
    const MIN_PASSWORD_SIZE = 8;
    const MAX_EMAIL_SIZE = 50;
    const MAX_PASSWORD_SIZE = 50;

    const testUser = {
        email: 'testemail@example.com',
        password: 'testpassword'
    };

    /** Helper functions **/
    const registerUser = (user, failOnStatusCode = true) => {
        return cy.request({
            method: 'POST',
            url: '/api/auth/register',
            body: user,
            failOnStatusCode
        });
    };

    const deleteUser = (email) => {
        return cy.task('queryDb', `DELETE FROM users WHERE email = '${email}';`);
    };

    const assertErrorMessageExists = (response, status, message) => {
        expect(response.status).to.eq(status);
        expect(response.body.errors).to.be.an("array");
        
        const hasError = response.body.errors.some(error => error.msg === message);
        expect(hasError, `Expected error message: "${message}". Got: ${JSON.stringify(response.body.errors)}`).to.be.true;
    };

    /** Setup & Cleanup **/
    beforeEach(() => deleteUser(testUser.email));
    afterEach(() => deleteUser(testUser.email));

    /** User Registration Tests **/
    describe('User Registration', () => {
        it('should register a new user successfully', () => {
            registerUser(testUser).should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.user).to.have.property('id');
            });

            cy.task('queryDb', `SELECT * FROM users WHERE email = '${testUser.email}';`)
                .then((result) => {
                    expect(result.length).to.be.greaterThan(0);
                    expect(result[0].email).to.eq(testUser.email);
                    expect(result[0].password).to.not.eq(testUser.password); // Ensure password is hashed
                });
        });

        it('should not register a user with an existing email', () => {
            registerUser(testUser);
            registerUser(testUser, false).should((response) => {
                assertErrorMessageExists(response, 400, 'User already exists');
            });
        });

        const missingFields = ["email", "password"];
        missingFields.forEach((field) => {
            it(`should not register a user with missing ${field}`, () => {
                const invalidUser = { ...testUser };
                delete invalidUser[field];

                const errorMessages = {
                    email: "Email is required",
                    password: "Password is required",
                };

                registerUser(invalidUser, false).should((response) => {
                    assertErrorMessageExists(response, 400, errorMessages[field]);
                });
            });
        });

        it(`should not register a user with an email longer than ${MAX_EMAIL_SIZE} characters`, () => {
            const invalidUser = { ...testUser, email: "a".repeat(MAX_EMAIL_SIZE + 1) };

            registerUser(invalidUser, false).should((response) => {
                assertErrorMessageExists(response, 400, `Email must be at most ${MAX_EMAIL_SIZE} characters`);
            });
        });

        it(`should not register a user with a password shorter than ${MIN_PASSWORD_SIZE} characters`, () => {
            const invalidUser = { ...testUser, password: "a".repeat(MIN_PASSWORD_SIZE - 1) };

            registerUser(invalidUser, false).should((response) => {
                assertErrorMessageExists(response, 400, `Password must be between ${MIN_PASSWORD_SIZE} and ${MAX_PASSWORD_SIZE} characters`);
            });
        });

        it(`should not register a user with a password longer than ${MAX_PASSWORD_SIZE} characters`, () => {
            const invalidUser = { ...testUser, password: "a".repeat(MAX_PASSWORD_SIZE + 1) };

            registerUser(invalidUser, false).should((response) => {
                assertErrorMessageExists(response, 400, `Password must be between ${MIN_PASSWORD_SIZE} and ${MAX_PASSWORD_SIZE} characters`);
            });
        });
    });

    /** User Login Tests **/
    describe('User Login', () => {
        beforeEach(() => registerUser(testUser));

        it('should log in a user successfully', () => {
            cy.request('POST', '/api/auth/login', {
                email: testUser.email,
                password: testUser.password
            }).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token');
            });
        });

        it('should not log in a user with an invalid password', () => {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: { email: testUser.email, password: 'wrongpassword' },
                failOnStatusCode: false
            }).should((response) => {
                assertErrorMessageExists(response, 401, 'Invalid credentials');
            });
        });

        it('should not log in a user that does not exist', () => {
            cy.request({
                method: 'POST',
                url: '/api/auth/login',
                body: { email: 'invalid@mail.com', password: 'password123' },
                failOnStatusCode: false
            }).should((response) => {
                assertErrorMessageExists(response, 401, 'Invalid credentials');
            });
        });

        const missingFields = ['email', 'password'];
        missingFields.forEach((field) => {
            it(`should not log in a user with missing ${field}`, () => {
                const invalidUser = { ...testUser };
                delete invalidUser[field];

                const errorMessages = {
                    email: 'Email is required',
                    password: 'Password is required',
                };

                cy.request({
                    method: 'POST',
                    url: '/api/auth/login',
                    body: invalidUser,
                    failOnStatusCode: false
                }).should((response) => {
                    assertErrorMessageExists(response, 400, errorMessages[field]);
                });
            });
        });
    });
});
