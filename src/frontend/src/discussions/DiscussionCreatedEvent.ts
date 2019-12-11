import { IEvent } from "../events";
import { Discussion } from "./Discussion";
import { EventInfo } from "../events/EventInfo";

export class DiscussionCreatedEvent implements IEvent {
  static type: string = "discussionCreatedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionCreatedEvent.type);
  }
}