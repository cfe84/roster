import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { RatingCriteria } from ".";

class RatingCriteriaEvent implements ITypedEvent<RatingCriteria> {
  info: EventInfo;
  constructor(public entity: RatingCriteria, public type: string) {
    this.info = new EventInfo(type, "RatingCriteria", entity.id);
  }
}

export class RatingCriteriaCreatedEvent extends RatingCriteriaEvent {
  public static type: string = "RatingCriteriaCreatedEvent";
  constructor(public entity: RatingCriteria) {
    super(entity, RatingCriteriaCreatedEvent.type);
  }
}

export class RatingCriteriaUpdatedEvent extends RatingCriteriaEvent {
  public static type: string = "RatingCriteriaUpdatedEvent";
  constructor(public entity: RatingCriteria) {
    super(entity, RatingCriteriaUpdatedEvent.type);
  }
}

export class RatingCriteriaDeletedEvent extends RatingCriteriaEvent {
  public static type: string = "RatingCriteriaDeletedEvent";
  constructor(public entity: RatingCriteria) {
    super(entity, RatingCriteriaDeletedEvent.type);
  }
}