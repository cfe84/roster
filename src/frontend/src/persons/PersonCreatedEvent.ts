import { IEvent } from "../events";
import { Person } from "./Person";
import { EventInfo } from "../events/EventInfo";

export class PersonCreatedEvent implements IEvent {
  static type: string = "personCreatedEvent";
  info = new EventInfo(PersonCreatedEvent.type);
  constructor(public person: Person) { }

}