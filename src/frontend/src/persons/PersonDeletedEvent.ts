import { IEvent } from "../../lib/common/events/";
import { Person } from "./Person";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class PersonDeletedEvent implements IEvent {
  static type: string = "personDeletedEvent";
  info = new EventInfo(PersonDeletedEvent.type);
  constructor(public person: Person) { }

}