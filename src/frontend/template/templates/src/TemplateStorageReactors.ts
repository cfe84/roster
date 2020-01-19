import { ITemplateStore } from "./ITemplateStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PersonDeletedEvent } from "../persons/PersonEvent";
import { TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDeletedEvent } from "./TemplateEvents";

export class TemplateStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(TemplateCreatedEvent.type, (evt: TemplateCreatedEvent) => this.templateStore.createTemplateAsync(evt.entity));
    eventBus.subscribe(TemplateUpdatedEvent.type, (evt: TemplateCreatedEvent) => this.templateStore.updateTemplateAsync(evt.entity));
    eventBus.subscribe(TemplateDeletedEvent.type, (evt: TemplateCreatedEvent) => this.templateStore.deleteTemplateAsync(evt.entity));
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: PersonDeletedEvent) => {
      const templates = (await this.templateStore.getTemplatesAsync()).filter((template) => template.personId === evt.person.id);
      await Promise.all(templates.map((template) => eventBus.publishAsync(new TemplateDeletedEvent(template))));
    });
  }
  constructor(private templateStore: ITemplateStore) { }

}