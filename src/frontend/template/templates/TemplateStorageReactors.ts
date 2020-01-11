import { ITemplateStore } from "./ITemplateStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDeletedEvent } from "./TemplateEvents";

export class TemplateStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(TemplateCreatedEvent.type, (evt: TemplateCreatedEvent) => this.actionStore.createTemplateAsync(evt.entity));
    eventBus.subscribe(TemplateUpdatedEvent.type, (evt: TemplateCreatedEvent) => this.actionStore.updateTemplateAsync(evt.entity));
    eventBus.subscribe(TemplateDeletedEvent.type, (evt: TemplateCreatedEvent) => this.actionStore.deleteTemplateAsync(evt.entity));
  }
  constructor(private actionStore: ITemplateStore) { }

}