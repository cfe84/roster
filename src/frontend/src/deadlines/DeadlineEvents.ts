import { IEvent } from "../events";
import { Deadline } from "./Deadline";
import { EventInfo } from "../events/EventInfo";

export class DeadlineCreatedEvent implements IEvent {
  static type: string = "DeadlineCreatedEvent";
  info: EventInfo;
  constructor(public deadline: Deadline) {
    this.info = new EventInfo(DeadlineCreatedEvent.type);
  }
}

export class DeadlineUpdatedEvent implements IEvent {
  static type: string = "DeadlineUpdatedEvent";
  info: EventInfo;
  constructor(public deadline: Deadline) {
    this.info = new EventInfo(DeadlineUpdatedEvent.type);
  }
}

export class DeadlineDeletedEvent implements IEvent {
  static type: string = "DeadlineDeletedEvent";
  info: EventInfo;
  constructor(public deadline: Deadline) {
    this.info = new EventInfo(DeadlineDeletedEvent.type);
  }
}