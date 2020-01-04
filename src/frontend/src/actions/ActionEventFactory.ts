import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { Action } from ".";
import { ActionCreatedEvent, ActionUpdatedEvent, ActionDeletedEvent } from "./ActionEvents";

export class ActionEventFactory implements IEventFactory<Action> {
  createCreatedEvent(entity: Action): ITypedEvent<Action> {
    return new ActionCreatedEvent(entity);
  }

  createUpdatedEvent(entity: Action): ITypedEvent<Action> {
    return new ActionUpdatedEvent(entity);
  }
  createDeletedEvent(entity: Action): ITypedEvent<Action> {
    return new ActionDeletedEvent(entity);
  }

  get createdEventType() { return ActionCreatedEvent.type; };
  get updatedEventType() { return ActionUpdatedEvent.type; };
  get deletedEventType() { return ActionDeletedEvent.type; };

}