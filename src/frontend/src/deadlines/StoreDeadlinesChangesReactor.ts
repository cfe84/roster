import { EventBus, IEvent } from "../../lib/common/events/";
import { IDeadlineStore } from "./IDeadlineStore";
import { DeadlineCreatedEvent, DeadlineUpdatedEvent, DeadlineDeletedEvent } from "./DeadlineEvents";

export class StoreDeadlinesChangesReactor {
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
  }
}