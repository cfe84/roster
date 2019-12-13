import { IEvent } from "../../lib/common/events";
import { EventInfo } from "../../lib/common/events/EventInfo";
import { ClientId } from "./Message";

export class EventReceivedEvent implements IEvent {
  static type: string = "EventReceivedEvent";
  public info: EventInfo = new EventInfo(EventReceivedEvent.type);
  constructor(public event: IEvent, public emitterId: ClientId) { }
}