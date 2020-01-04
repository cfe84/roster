import { IActionStore } from "./IActionStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { ActionCreatedEvent, ActionUpdatedEvent, ActionDeletedEvent } from "./ActionEvents";

export class ActionStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(ActionCreatedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.createActionAsync(evt.entity));
    eventBus.subscribe(ActionUpdatedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.updateActionAsync(evt.entity));
    eventBus.subscribe(ActionDeletedEvent.type, (evt: ActionCreatedEvent) => this.actionStore.deleteActionAsync(evt.entity));
  }
  constructor(private actionStore: IActionStore) { }

}