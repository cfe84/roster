# Synchronizing events

**State**: to-do

The application is synchronizing events to and from the backend, the backend is storing the events for the user.

In case of conflict, the initial resolution strategy is LWW (last write wins).