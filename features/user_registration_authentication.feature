Feature: User Registration & Authentication
  In order to access the Matcha platform
  As a new or existing user
  I want to register, verify my account, reset passwords, and log in/out securely

  Scenario: User Registration
    Given I am on the registration page
    When I fill in valid "email", "username", "first name", "last name" and "password"
    And I submit the registration form
    Then I should see a confirmation message
    And my account should be created in a "pending email verification" state

  Scenario: Account Verification via Email
    Given I am a user with a "pending verification" account
    And I have received a verification email
    When I click on the verification link
    Then my account status should be updated to "active"
    And I should be able to log in

  Scenario: Password Reset
    Given I have forgotten my password
    When I click on the "Forgot Password" link
    And I enter my registered email address
    Then I should receive an email with a unique reset link
    When I open that link and set a new valid password
    Then I should be able to log in with my new password

  Scenario: Login and Logout
    Given I am on the login page
    When I enter my valid email/username and password
    Then I should be redirected to my dashboard
    And I should see a "Logout" button
    When I click on "Logout"
    Then I should be logged out and see the login screen again
