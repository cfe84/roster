import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { Observation } from ".";
import { ObservationCreatedEvent, ObservationUpdatedEvent, ObservationDeletedEvent } from "./ObservationEvents";

export class ObservationEventFactory implements IEventFactory<Observation> {
  createCreatedEvent(entity: Observation): ITypedEvent<Observation> {
    return new ObservationCreatedEvent(entity);
  }

  createUpdatedEvent(entity: Observation): ITypedEvent<Observation> {
    return new ObservationUpdatedEvent(entity);
  }
  createDeletedEvent(entity: Observation): ITypedEvent<Observation> {
    return new ObservationDeletedEvent(entity);
  }

  get createdEventType() { return ObservationCreatedEvent.type; };
  get updatedEventType() { return ObservationUpdatedEvent.type; };
  get deletedEventType() { return ObservationDeletedEvent.type; };

}