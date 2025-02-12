Feature: Browsing and Swiping Profiles
  As a user
  I want to browse through potential matches
  So that I can find people I’m interested in and connect with them

  Scenario: View a list of suggested profiles
    Given I am logged into the app
    When I open the "Discover" or "Browse" section
    Then I should see a list of suggested profiles
    And the profiles should be based on my preferences, location, and interests

  Scenario: Swipe right to like a profile
    Given I am viewing a profile
    When I swipe right or click the "Like" button
    Then the profile should be added to my "Liked" list
    And the other user should receive a notification if they have also liked me

  Scenario: Swipe left to pass on a profile
    Given I am viewing a profile
    When I swipe left or click the "Pass" button
    Then the profile should not appear in my suggested list again

  Scenario: Undo last swipe (if applicable)
    Given I accidentally swiped left on a profile
    When I click the "Undo" button within 5 seconds
    Then the profile should reappear in my browsing list

  Scenario: View a profile before deciding
    Given I am browsing profiles
    When I click on a user’s profile picture
    Then I should see their full profile details including name, bio, interests, and Fame Rating

  Scenario: Filter and sort suggestions
    Given I am on the browsing page
    When I set filters for age, location, or interests
    Then the suggested profiles should update based on my filters

  Scenario: Run out of profiles to browse
    Given I have swiped on all available users
    When I refresh the page
    Then I should see a message saying "No more profiles available. Check back later!"
