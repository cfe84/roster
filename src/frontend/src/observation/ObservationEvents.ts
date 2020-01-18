import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { Observation } from ".";

class ObservationEvent implements ITypedEvent<Observation> {
  info: EventInfo;
  constructor(public entity: Observation, public type: string) {
    this.info = new EventInfo(type, "Observation", entity.id);
  }
}

export class ObservationCreatedEvent extends ObservationEvent {
  public static type: string = "ObservationCreatedEvent";
  constructor(public entity: Observation) {
    super(entity, ObservationCreatedEvent.type);
  }
}

export class ObservationUpdatedEvent extends ObservationEvent {
  public static type: string = "ObservationUpdatedEvent";
  constructor(public entity: Observation) {
    super(entity, ObservationUpdatedEvent.type);
  }
}

export class ObservationDeletedEvent extends ObservationEvent {
  public static type: string = "ObservationDeletedEvent";
  constructor(public entity: Observation) {
    super(entity, ObservationDeletedEvent.type);
  }
}