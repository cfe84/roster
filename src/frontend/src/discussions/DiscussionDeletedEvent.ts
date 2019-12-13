import { IEvent } from "../../lib/common/events/";
import { Discussion } from "./Discussion";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class DiscussionDeletedEvent implements IEvent {
  static type: string = "discussionDeletedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionDeletedEvent.type);
  }
}