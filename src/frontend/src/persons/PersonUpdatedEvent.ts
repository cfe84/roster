import { IEvent } from "../../lib/common/events/";
import { Person } from "./Person";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class PersonUpdatedEvent implements IEvent {
  static type: string = "personUpdatedEvent";
  info = new EventInfo(PersonUpdatedEvent.type);
  constructor(public person: Person) { }

}