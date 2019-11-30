import { IPersonStore } from "./IPersonStore";
import { EventBus, IEvent } from "../events";
import { PersonCreatedEvent } from "./PersonCreatedEvent";
import { PersonUpdatedEvent } from "./PersonUpdatedEvent";

export class StorePeopleChangesReactor {
  constructor(private store: IPersonStore) { }

  registerReactors(eventBus: EventBus) {
    eventBus.subscribe(PersonCreatedEvent.type, async (evt: IEvent) => {
      const event = evt as PersonCreatedEvent;
      await this.store.createPersonAsync(event.person);
    });
    eventBus.subscribe(PersonUpdatedEvent.type, async (evt: IEvent) => {
      const event = evt as PersonUpdatedEvent;
      await this.store.updatePersonAsync(event.person);
    });
  }
}