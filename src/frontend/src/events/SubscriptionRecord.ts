import { eventHandler, eventType } from "./EventBus";
import { GUID } from "../utils/guid";
import { IEvent } from ".";

export class SubscriptionRecord<T extends IEvent> {
  public id: string;
  constructor(public type: eventType, public handler: eventHandler<T>) {
    this.id = GUID.newGuid();
  }
}