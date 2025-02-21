Feature: Profile Interaction
  In order to connect and manage visibility
  As a user
  I want to view detailed profiles, like them, see who viewed mine, report or block users

  Scenario: Viewing Profiles
    Given I see a user in the suggestions
    When I click on their thumbnail
    Then I should see their full profile (excluding private info like email/password)
    And I should have options to like, report, or block

  Scenario: Like a Profile
    Given I am viewing a user’s profile
    When I click the "Like" button
    Then that user should receive a notification of my like
    And if they like me back, we should both have access to the chat feature

  Scenario: Profile Views Tracking
    Given I am logged in
    When another user views my profile
    Then I should see that user in my "Recent Views" list
    And I should receive a notification if I have that setting enabled

  Scenario: Report and Block Users
    Given I encounter a user with inappropriate behavior
    When I click the "Report" or "Block" button on their profile
    Then the system should hide that user from my searches and messages
    And record the report for moderation and potential Fame Rating penalty
