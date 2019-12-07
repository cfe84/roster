import { eventHandler, eventType } from "./EventBus";
import { GUID } from "../utils/guid";
import { IEvent, EventBus } from ".";

export class SubscriptionRecord<T extends IEvent> {
  public id: string;
  constructor(public type: eventType, public handler: eventHandler<T>, private eventBus: EventBus) {
    this.id = GUID.newGuid();
  }
  unsubscribe = () => {
    this.eventBus.unsubscribe(this);
  }
}