describe('Backend API Authentication Tests', () => {
	const MIN_PASSWORD_SIZE = 8;
	const MAX_NAME_SIZE = 30;
	const MAX_EMAIL_SIZE = 50;
	const MAX_PASSWORD_SIZE = 50;

    const testUser = {
        name: 'testname',
        email: 'testemail@example.com',
        password: 'testpassword'
    };

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
	
		// Check if at least one object in the errors array contains the expected message
		const hasError = response.body.errors.some(error => error.msg === message);
		expect(hasError, `Expected error message: "${message}". Got: ${JSON.stringify(response.body.errors)}`).to.be.true;
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
				assertErrorMessageExists(response, 400, 'User already exists');
            });
        });

		const missingFields = ["name", "email", "password"];

		missingFields.forEach((field) => {
			it(`should not register a user with missing ${field}`, () => {
				const invalidUser = { ...testUser };
				delete invalidUser[field];
		
				registerUser(invalidUser, false).should((response) => {
					expect(response.status).to.eq(400);
		
					const errorMessages = {
						name: "Name is required",
						email: "Email is required",
						password: "Password is required",
					};
		
					assertErrorMessageExists(response, 400, errorMessages[field]);
				});
			});
		});

		const maxLengthFields = {
			name: MAX_NAME_SIZE,
			email: MAX_EMAIL_SIZE
		};

		Object.entries(maxLengthFields).forEach(([field, maxLength]) => {
			it(`should not register a user with ${field} longer than ${maxLength} characters`, () => {
				const invalidUser = { ...testUser, [field]: "a".repeat(maxLength + 1) };

				registerUser(invalidUser, false).should((response) => {
					expect(response.status).to.eq(400);
					assertErrorMessageExists(response, 400, `${field.charAt(0).toUpperCase() + field.slice(1)} must be at most ${maxLength} characters`);
				});
			});
		});

		it(`should not register a user with password shorter than ${MIN_PASSWORD_SIZE} characters`, () => {
			const invalidUser = { ...testUser, password: "a".repeat(MIN_PASSWORD_SIZE - 1) };

			registerUser(invalidUser, false).should((response) => {
				expect(response.status).to.eq(400);
				assertErrorMessageExists(response, 400, `Password must be between ${MIN_PASSWORD_SIZE} and ${MAX_PASSWORD_SIZE} characters`);
			});
		});

		it(`should not register a user with password longer than ${MAX_PASSWORD_SIZE} characters`, () => {
			const invalidUser = { ...testUser, password: "a".repeat(MAX_PASSWORD_SIZE + 1) };

			registerUser(invalidUser, false).should((response) => {
				expect(response.status).to.eq(400);
				assertErrorMessageExists(response, 400, `Password must be between ${MIN_PASSWORD_SIZE} and ${MAX_PASSWORD_SIZE} characters`);
			});
		});
    });

    describe('User Login', () => {
        it('should login a user', () => {
            registerUser(testUser);

            cy.request('POST', '/api/auth/login', {
                email: testUser.email,
                password: testUser.password
            }).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token');
            });
        });

		it('should not login a user with invalid password', () => {
			registerUser(testUser);

			cy.request({
				method: 'POST',
				url: '/api/auth/login',
				body: {
					email: testUser.email,
					password: 'invalidpassword'
				},
				failOnStatusCode: false
			}).should((response) => {
				expect(response.status).to.eq(401);
				assertErrorMessageExists(response, 401, 'Invalid credentials');
			});
		});

		it('should not login a user that doesn\'t exist', () => {

			cy.request({
				method: 'POST',
				url: '/api/auth/login',
				body: {
					email: 'invalid@mail.com',
					password: 'invalidpassword',
				},
				failOnStatusCode: false
			}).should((response) => {
				expect(response.status).to.eq(401);
				assertErrorMessageExists(response, 401, 'Invalid credentials');
			});
		});

		const missingFields = ['email', 'password'];
		missingFields.forEach((field) => {
			it(`should not login a user with missing ${field}`, () => {
				const invalidUser = { ...testUser };
				delete invalidUser[field];

				const errorMessages = {
					email: 'Email is required',
					password: 'Password is required',
				};
	
				registerUser(invalidUser, false).should((response) => {
					expect(response.status).to.eq(400);
					assertErrorMessageExists(response, 400, errorMessages[field]);
				});
			});
		});
	});
});
