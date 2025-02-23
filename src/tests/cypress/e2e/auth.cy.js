describe('Backend API Authentication Tests', () => {
    const testUser = {
        name: 'testname',
        email: 'testemail@example.com',
        password: 'testpassword'
    };

    // Helper function to register a user
    const registerUser = (user, failOnStatusCode = true) => {
        return cy.request({
            method: 'POST',
            url: '/api/auth/register',
            body: user,
            failOnStatusCode
        });
    };

    // Helper function to delete a user from the database
    const deleteUser = (email) => {
        return cy.task('queryDb', `DELETE FROM users WHERE email = '${email}';`);
    };

    beforeEach(() => {
        deleteUser(testUser.email);
    });

    afterEach(() => {
        deleteUser(testUser.email);
    });

    describe('User Registration', () => {
        it('should register a new user', () => {
            registerUser(testUser).should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.success).to.eq(true);
                expect(response.body.user).to.have.property('id');
                expect(response.body.user).to.have.property('name', testUser.name);
                expect(response.body.user).to.have.property('email', testUser.email);
            });

            // Verify user in the database
            cy.task('queryDb', `SELECT * FROM users WHERE email = '${testUser.email}';`)
                .then((result) => {
                    expect(result.length).to.be.greaterThan(0);
                    expect(result[0].name).to.eq(testUser.name);
                    expect(result[0].email).to.eq(testUser.email);
                    expect(result[0].password).to.not.eq(testUser.password); // Ensure password is hashed
                });
        });

        it('should not register a user with an existing email', () => {
            registerUser(testUser);

            registerUser(testUser, false).should((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.eq(false);
                expect(response.body.message).to.eq('User already exists');
            });
        });

        const missingFields = ['name', 'email', 'password'];

        missingFields.forEach((field) => {
            it(`should not register a user with missing ${field}`, () => {
                const invalidUser = { ...testUser };
                delete invalidUser[field];

                registerUser(invalidUser, false).should((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.eq(false);
                    expect(response.body.message).to.eq('All fields are required');
                });
            });
        });
    });

    /* describe('User Login', () => {
        it('should login a user', () => {
            registerUser(testUser);

            cy.request('POST', '/api/auth/login', {
                email: testUser.email,
                password: testUser.password
            }).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.eq(true);
                expect(response.body).to.have.property('token');
            });
        });
    }); */
});
