Feature: Chat System
  As a user
  I want to chat in real-time with my connected matches
  So that I can communicate seamlessly and build connections

  Scenario: Send a message to a connected user
    Given I have a mutual match with another user
    When I open the chat window
    And I type "Hey, how are you?" in the message box
    And I click the send button
    Then the message should appear in the chat history
    And the recipient should see a notification for a new message

  Scenario: Receive a message from a connected user
    Given I have a mutual match with another user
    And the other user sends me a message
    When I check my chat history
    Then I should see the received message
    And I should get a real-time notification on any page

  Scenario: View new message notification from any page
    Given I am logged in
    And I have an unread message
    When I navigate to a different page
    Then I should see a chat notification icon with an unread message count

  Scenario: Attempt to send a message without a mutual match
    Given I am not connected with the other user
    When I try to open a chat with them
    Then I should see an error message "You must be connected to start a chat"
