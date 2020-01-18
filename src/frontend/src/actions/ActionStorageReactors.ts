import { IActionStore } from "./IActionStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { ActionCreatedEvent, ActionUpdatedEvent, ActionDeletedEvent } from "./ActionEvents";
import { PersonDeletedEvent } from "../persons/PersonEvent";

export class ActionStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(ActionCreatedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.createActionAsync(evt.entity));
    eventBus.subscribe(ActionUpdatedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.updateActionAsync(evt.entity));
    eventBus.subscribe(ActionDeletedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.deleteActionAsync(evt.entity));
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: PersonDeletedEvent) => {
      const periods = (await this.actionStore.getActionsAsync()).filter((action) => action.personId === evt.person.id);
      await Promise.all(periods.map((action) => eventBus.publishAsync(new ActionDeletedEvent(action))));
    });
  }
  constructor(private actionStore: IActionStore) { }

}