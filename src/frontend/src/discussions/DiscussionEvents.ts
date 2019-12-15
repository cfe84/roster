import { IEvent } from "../../lib/common/events";
import { Discussion, DiscussionObjectType } from "./Discussion";
import { EventInfo } from "../../lib/common/events/EventInfo";

export class DiscussionCreatedEvent implements IEvent {
  static type: string = "discussionCreatedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionCreatedEvent.type, DiscussionObjectType, discussion.id);
  }
}

export class DiscussionUpdatedEvent implements IEvent {
  static type: string = "discussionUpdatedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionUpdatedEvent.type, DiscussionObjectType, discussion.id);
  }
}

export class DiscussionDeletedEvent implements IEvent {
  static type: string = "discussionDeletedEvent";
  info: EventInfo;
  constructor(public discussion: Discussion) {
    this.info = new EventInfo(DiscussionDeletedEvent.type, DiscussionObjectType, discussion.id);
  }
}