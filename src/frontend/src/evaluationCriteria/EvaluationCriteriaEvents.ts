import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { EvaluationCriteria } from ".";

class EvaluationCriteriaEvent implements ITypedEvent<EvaluationCriteria> {
  info: EventInfo;
  constructor(public entity: EvaluationCriteria, public type: string) {
    this.info = new EventInfo(type, "EvaluationCriteria", entity.id);
  }
}

export class EvaluationCriteriaCreatedEvent extends EvaluationCriteriaEvent {
  public static type: string = "EvaluationCriteriaCreatedEvent";
  constructor(public entity: EvaluationCriteria) {
    super(entity, EvaluationCriteriaCreatedEvent.type);
  }
}

export class EvaluationCriteriaUpdatedEvent extends EvaluationCriteriaEvent {
  public static type: string = "EvaluationCriteriaUpdatedEvent";
  constructor(public entity: EvaluationCriteria) {
    super(entity, EvaluationCriteriaUpdatedEvent.type);
  }
}

export class EvaluationCriteriaDeletedEvent extends EvaluationCriteriaEvent {
  public static type: string = "EvaluationCriteriaDeletedEvent";
  constructor(public entity: EvaluationCriteria) {
    super(entity, EvaluationCriteriaDeletedEvent.type);
  }
}