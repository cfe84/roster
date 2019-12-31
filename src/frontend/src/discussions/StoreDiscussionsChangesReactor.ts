import { EventBus, IEvent } from "../../lib/common/events/";
import { IDiscussionStore } from "./IDiscussionStore";
import { DiscussionCreatedEvent, DiscussionUpdatedEvent, DiscussionDeletedEvent } from "./DiscussionEvents";
import { IReactor } from "../storage/IReactor";
import { PersonDeletedEvent } from "../persons/PersonEvent";

export class StoreDiscussionsChangesReactor implements IReactor {
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
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: PersonDeletedEvent) => {
      const discussions = (await this.store.getDiscussionsAsync()).filter((discussion) => discussion.personId === evt.person.id);
      await Promise.all(discussions.map((discussion) => eventBus.publishAsync(new DiscussionDeletedEvent(discussion))));
    })
  }
}