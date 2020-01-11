import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { Template } from ".";

class TemplateEvent implements ITypedEvent<Template> {
  info: EventInfo;
  constructor(public entity: Template, public type: string) {
    this.info = new EventInfo(type, "Template", entity.id);
  }
}

export class TemplateCreatedEvent extends TemplateEvent {
  public static type: string = "TemplateCreatedEvent";
  constructor(public entity: Template) {
    super(entity, TemplateCreatedEvent.type);
  }
}

export class TemplateUpdatedEvent extends TemplateEvent {
  public static type: string = "TemplateUpdatedEvent";
  constructor(public entity: Template) {
    super(entity, TemplateUpdatedEvent.type);
  }
}

export class TemplateDeletedEvent extends TemplateEvent {
  public static type: string = "TemplateDeletedEvent";
  constructor(public entity: Template) {
    super(entity, TemplateDeletedEvent.type);
  }
}