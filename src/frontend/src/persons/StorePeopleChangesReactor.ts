import { IPersonStore } from "./IPersonStore";
import { EventBus, IEvent } from "../../lib/common/events/";
import { PersonCreatedEvent, PersonUpdatedEvent, PersonDeletedEvent } from "./PersonEvent";

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
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: IEvent) => {
      const event = evt as PersonDeletedEvent;
      await this.store.deletePersonAsync(event.person);
    });
  }
}