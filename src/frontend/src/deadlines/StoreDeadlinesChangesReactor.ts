import { EventBus, IEvent } from "../../lib/common/events/";
import { IDeadlineStore } from "./IDeadlineStore";
import { DeadlineCreatedEvent, DeadlineUpdatedEvent, DeadlineDeletedEvent } from "./DeadlineEvents";
import { PersonDeletedEvent } from "../persons/PersonEvent";
import { IReactor } from "../storage/IReactor";

export class StoreDeadlinesChangesReactor implements IReactor {
  constructor(private store: IDeadlineStore) { }

  registerReactors(eventBus: EventBus) {
    eventBus.subscribe(DeadlineCreatedEvent.type, async (evt: DeadlineCreatedEvent) => {
      await this.store.createDeadlineAsync(evt.deadline);
    });
    eventBus.subscribe(DeadlineUpdatedEvent.type, async (evt: DeadlineUpdatedEvent) => {
      await this.store.updateDeadlineAsync(evt.deadline);
    });
    eventBus.subscribe(DeadlineDeletedEvent.type, async (evt: DeadlineDeletedEvent) => {
      await this.store.deleteDeadlineAsync(evt.deadline);
    })
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: PersonDeletedEvent) => {
      const deadlines = (await this.store.getDeadlinesAsync()).filter((deadline) => deadline.personId === evt.person.id);
      await Promise.all(deadlines.map((deadline) => eventBus.publishAsync(new DeadlineDeletedEvent(deadline))));
    })
  }
}