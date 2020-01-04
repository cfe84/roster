import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { Action } from ".";

class ActionEvent implements ITypedEvent<Action> {
  info: EventInfo;
  constructor(public entity: Action, public type: string) {
    this.info = new EventInfo(type, "Action", entity.id);
  }
}

export class ActionCreatedEvent extends ActionEvent {
  public static type: string = "ActionCreatedEvent";
  constructor(public entity: Action) {
    super(entity, ActionCreatedEvent.type);
  }
}

export class ActionUpdatedEvent extends ActionEvent {
  public static type: string = "ActionUpdatedEvent";
  constructor(public entity: Action) {
    super(entity, ActionUpdatedEvent.type);
  }
}

export class ActionDeletedEvent extends ActionEvent {
  public static type: string = "ActionDeletedEvent";
  constructor(public entity: Action) {
    super(entity, ActionDeletedEvent.type);
  }
}