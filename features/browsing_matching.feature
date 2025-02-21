Feature: Browsing & Matching
  In order to find potential matches
  As a user
  I want to see relevant suggestions and perform advanced searches

  Scenario: Browsing & Matching
    Given I am a logged-in user with a complete profile
    When I navigate to the "Discover" or "Suggested Profiles" page
    Then I should see a list of suggested users
    And those users should be sorted by location, shared interests, and Fame Rating

  Scenario: Advanced Search
    Given I am on the matching page
    When I set filters for "age range", "location", "Fame Rating range", and "interest tags"
    And I apply the search
    Then I should see a filtered list of users that match all selected criteria
