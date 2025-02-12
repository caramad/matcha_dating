Feature: Chat & Notifications
  In order to communicate in real time and stay updated
  As a matched user
  I want to chat with mutual likes and receive notifications

  Scenario: Chat System
    Given I have a mutual like with another user
    When I open the "Messages" or "Chat" section
    Then I should be able to send and receive messages in real-time
    And I should see new messages immediately without refreshing the page

  Scenario: Notifications
    Given there are events (likes, messages, profile views, mutual matches) relevant to me
    When these events occur
    Then I should see an in-app notification
    And optionally receive an email notification if enabled
