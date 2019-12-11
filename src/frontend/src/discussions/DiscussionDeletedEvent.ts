import { IEvent } from "../events";
import { Discussion } from "./Discussion";
import { EventInfo } from "../events/EventInfo";

export class DiscussionDeletedEvent implements IEvent {
  static type: string = "discussionDeletedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionDeletedEvent.type);
  }
}