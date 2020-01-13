import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { EvaluationCriteria } from ".";
import { EvaluationCriteriaCreatedEvent, EvaluationCriteriaUpdatedEvent, EvaluationCriteriaDeletedEvent } from "./EvaluationCriteriaEvents";

export class EvaluationCriteriaEventFactory implements IEventFactory<EvaluationCriteria> {
  createCreatedEvent(entity: EvaluationCriteria): ITypedEvent<EvaluationCriteria> {
    return new EvaluationCriteriaCreatedEvent(entity);
  }

  createUpdatedEvent(entity: EvaluationCriteria): ITypedEvent<EvaluationCriteria> {
    return new EvaluationCriteriaUpdatedEvent(entity);
  }
  createDeletedEvent(entity: EvaluationCriteria): ITypedEvent<EvaluationCriteria> {
    return new EvaluationCriteriaDeletedEvent(entity);
  }

  get createdEventType() { return EvaluationCriteriaCreatedEvent.type; };
  get updatedEventType() { return EvaluationCriteriaUpdatedEvent.type; };
  get deletedEventType() { return EvaluationCriteriaDeletedEvent.type; };

}