import { IEvent } from "../events";
import { Person } from "./Person";
import { EventInfo } from "../events/EventInfo";

export class PersonUpdatedEvent implements IEvent {
  static type: string = "personUpdatedEvent";
  info = new EventInfo(PersonUpdatedEvent.type);
  constructor(public person: Person) { }

}