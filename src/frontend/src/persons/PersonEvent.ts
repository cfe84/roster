import { IEvent } from "../../lib/common/events";
import { Person, PersonType as PersonObjectType } from "./Person";
import { EventInfo } from "../../lib/common/events/EventInfo";

export class PersonCreatedEvent implements IEvent {
  static type: string = "personCreatedEvent";
  info: EventInfo;
  constructor(public person: Person) {
    this.info = new EventInfo(PersonCreatedEvent.type, PersonObjectType, person.id)
  }
}

export class PersonUpdatedEvent implements IEvent {
  static type: string = "personUpdatedEvent";
  info: EventInfo;
  constructor(public person: Person) {
    this.info = new EventInfo(PersonUpdatedEvent.type, PersonObjectType, person.id)
  }
}

export class PersonDeletedEvent implements IEvent {
  static type: string = "personDeletedEvent";
  info: EventInfo;
  constructor(public person: Person) {
    this.info = new EventInfo(PersonDeletedEvent.type, PersonObjectType, person.id)
  }
}