import { IEvent } from "../../lib/common/events/";
import { Discussion } from "./Discussion";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class DiscussionUpdatedEvent implements IEvent {
  static type: string = "discussionUpdatedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionUpdatedEvent.type);
  }
}