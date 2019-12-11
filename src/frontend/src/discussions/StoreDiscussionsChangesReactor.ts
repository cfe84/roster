import { EventBus, IEvent } from "../events";
import { IDiscussionStore } from "./IDiscussionStore";
import { DiscussionCreatedEvent } from "./DiscussionCreatedEvent";
import { DiscussionUpdatedEvent } from "./DiscussionUpdatedEvent";

export class StoreDiscussionsChangesReactor {
  constructor(private store: IDiscussionStore) { }

  registerReactors(eventBus: EventBus) {
    eventBus.subscribe(DiscussionCreatedEvent.type, async (evt: DiscussionCreatedEvent) => {
      await this.store.createDiscussionAsync(evt.discussion);
    });
    eventBus.subscribe(DiscussionUpdatedEvent.type, async (evt: DiscussionUpdatedEvent) => {
      await this.store.updateDiscussionAsync(evt.discussion);
    });
  }
}