import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { RatingCriteria } from ".";
import { RatingCriteriaCreatedEvent, RatingCriteriaUpdatedEvent, RatingCriteriaDeletedEvent } from "./RatingCriteriaEvents";

export class RatingCriteriaEventFactory implements IEventFactory<RatingCriteria> {
  createCreatedEvent(entity: RatingCriteria): ITypedEvent<RatingCriteria> {
    return new RatingCriteriaCreatedEvent(entity);
  }

  createUpdatedEvent(entity: RatingCriteria): ITypedEvent<RatingCriteria> {
    return new RatingCriteriaUpdatedEvent(entity);
  }
  createDeletedEvent(entity: RatingCriteria): ITypedEvent<RatingCriteria> {
    return new RatingCriteriaDeletedEvent(entity);
  }

  get createdEventType() { return RatingCriteriaCreatedEvent.type; };
  get updatedEventType() { return RatingCriteriaUpdatedEvent.type; };
  get deletedEventType() { return RatingCriteriaDeletedEvent.type; };

}