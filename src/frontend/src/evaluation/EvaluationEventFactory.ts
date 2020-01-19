import { IEventFactory, ITypedEvent } from "../../lib/common/events";
import { Evaluation } from ".";
import { EvaluationCreatedEvent, EvaluationUpdatedEvent, EvaluationDeletedEvent } from "./EvaluationEvents";

export class EvaluationEventFactory implements IEventFactory<Evaluation> {
  createCreatedEvent(entity: Evaluation): ITypedEvent<Evaluation> {
    return new EvaluationCreatedEvent(entity);
  }

  createUpdatedEvent(entity: Evaluation): ITypedEvent<Evaluation> {
    return new EvaluationUpdatedEvent(entity);
  }
  createDeletedEvent(entity: Evaluation): ITypedEvent<Evaluation> {
    return new EvaluationDeletedEvent(entity);
  }

  get createdEventType() { return EvaluationCreatedEvent.type; };
  get updatedEventType() { return EvaluationUpdatedEvent.type; };
  get deletedEventType() { return EvaluationDeletedEvent.type; };

}