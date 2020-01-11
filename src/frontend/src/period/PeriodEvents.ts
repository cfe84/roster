import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { Period } from ".";

class PeriodEvent implements ITypedEvent<Period> {
  info: EventInfo;
  constructor(public entity: Period, public type: string) {
    this.info = new EventInfo(type, "Period", entity.id);
  }
}

export class PeriodCreatedEvent extends PeriodEvent {
  public static type: string = "PeriodCreatedEvent";
  constructor(public entity: Period) {
    super(entity, PeriodCreatedEvent.type);
  }
}

export class PeriodUpdatedEvent extends PeriodEvent {
  public static type: string = "PeriodUpdatedEvent";
  constructor(public entity: Period) {
    super(entity, PeriodUpdatedEvent.type);
  }
}

export class PeriodDeletedEvent extends PeriodEvent {
  public static type: string = "PeriodDeletedEvent";
  constructor(public entity: Period) {
    super(entity, PeriodDeletedEvent.type);
  }
}