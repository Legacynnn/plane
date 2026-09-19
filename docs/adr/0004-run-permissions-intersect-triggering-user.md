# A human-triggered Run never exceeds the Triggering User's rights

Runs started by a person (Slack, mention, assignment, chat) act with the intersection of the Agent's scope and the Triggering User's permissions; scheduled and event Runs act with the Agent's own scope. Without this, anyone able to message the Slack bot could use an agent to do what they themselves may not. Unlinked Slack users cannot start Runs.
