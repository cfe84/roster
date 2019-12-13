import { EventBus, IEvent } from "../../lib/common/events/";
import { IDiscussionStore } from "./IDiscussionStore";
import { DiscussionCreatedEvent } from "./DiscussionCreatedEvent";
import { DiscussionUpdatedEvent } from "./DiscussionUpdatedEvent";
import { DiscussionDeletedEvent } from "./DiscussionDeletedEvent";

export class StoreDiscussionsChangesReactor {
  constructor(private store: IDiscussionStore) { }

  registerReactors(eventBus: EventBus) {
    eventBus.subscribe(DiscussionCreatedEvent.type, async (evt: DiscussionCreatedEvent) => {
      await this.store.createDiscussionAsync(evt.discussion);
    });
    eventBus.subscribe(DiscussionUpdatedEvent.type, async (evt: DiscussionUpdatedEvent) => {
      await this.store.updateDiscussionAsync(evt.discussion);
    });
    eventBus.subscribe(DiscussionDeletedEvent.type, async (evt: DiscussionDeletedEvent) => {
      await this.store.deleteDiscussionAsync(evt.discussion);
    })
  }
}