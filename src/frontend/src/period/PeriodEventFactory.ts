import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { Period } from ".";
import { PeriodCreatedEvent, PeriodUpdatedEvent, PeriodDeletedEvent } from "./PeriodEvents";

export class PeriodEventFactory implements IEventFactory<Period> {
  createCreatedEvent(entity: Period): ITypedEvent<Period> {
    return new PeriodCreatedEvent(entity);
  }

  createUpdatedEvent(entity: Period): ITypedEvent<Period> {
    return new PeriodUpdatedEvent(entity);
  }
  createDeletedEvent(entity: Period): ITypedEvent<Period> {
    return new PeriodDeletedEvent(entity);
  }

  get createdEventType() { return PeriodCreatedEvent.type; };
  get updatedEventType() { return PeriodUpdatedEvent.type; };
  get deletedEventType() { return PeriodDeletedEvent.type; };

}