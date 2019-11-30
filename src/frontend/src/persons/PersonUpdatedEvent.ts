import { IEvent } from "../events";
import { Person } from "./Person";

export class PersonUpdatedEvent implements IEvent {
  static type: string = "personUpdatedEvent";
  type: string = PersonUpdatedEvent.type;

  constructor(public person: Person) { }

}