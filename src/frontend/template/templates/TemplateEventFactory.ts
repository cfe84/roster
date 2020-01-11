import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { Template } from ".";
import { TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDeletedEvent } from "./TemplateEvents";

export class TemplateEventFactory implements IEventFactory<Template> {
  createCreatedEvent(entity: Template): ITypedEvent<Template> {
    return new TemplateCreatedEvent(entity);
  }

  createUpdatedEvent(entity: Template): ITypedEvent<Template> {
    return new TemplateUpdatedEvent(entity);
  }
  createDeletedEvent(entity: Template): ITypedEvent<Template> {
    return new TemplateDeletedEvent(entity);
  }

  get createdEventType() { return TemplateCreatedEvent.type; };
  get updatedEventType() { return TemplateUpdatedEvent.type; };
  get deletedEventType() { return TemplateDeletedEvent.type; };

}