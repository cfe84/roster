import { IEvent } from "../events";
import { Person } from "./Person";

export class PersonCreatedEvent implements IEvent {
  static type: string = "personCreatedEvent";
  type: string = PersonCreatedEvent.type;

  constructor(public person: Person) { }

}