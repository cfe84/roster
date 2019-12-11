import { IEvent } from "../events";
import { Person } from "./Person";
import { EventInfo } from "../events/EventInfo";

export class PersonDeletedEvent implements IEvent {
  static type: string = "personDeletedEvent";
  info = new EventInfo(PersonDeletedEvent.type);
  constructor(public person: Person) { }

}