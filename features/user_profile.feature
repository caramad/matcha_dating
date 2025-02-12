Feature: User Profile
  In order to share who I am and attract relevant matches
  As a user
  I want to complete, edit, and display my profile, including my Fame Rating

  Scenario: Complete User Profile
    Given I am a newly registered user
    When I navigate to "Profile Settings"
    And I fill in my "gender", "sexual preferences", "bio", "interest tags"
    And I upload up to 5 pictures, including a profile picture
    Then my profile should be considered complete
    And I should be visible in search results

  Scenario: Editing Profile
    Given I have a profile already
    When I go to the "Edit Profile" page
    And I change my "email", "name", "bio", "interests", or "pictures"
    And I click "Save Changes"
    Then my updated information should be reflected on my public profile

  Scenario: Fame Rating Display
    Given I have an active account with some engagement
    When I visit my own profile
    Then I should see my current Fame Rating
    And I should see a tooltip or explanation of how it is calculated
