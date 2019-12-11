import { IEvent } from "../events";
import { Discussion } from "./Discussion";
import { EventInfo } from "../events/EventInfo";

export class DiscussionUpdatedEvent implements IEvent {
  static type: string = "discussionUpdatedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionUpdatedEvent.type);
  }
}