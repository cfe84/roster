import { IEvent } from "../events";

export class PersonCreatedEvent implements IEvent {
  static type: string = "personCreatedEvent";
  type: string = PersonCreatedEvent.type;

  constructor(public name: string) { }

}