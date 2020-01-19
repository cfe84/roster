import { ITypedEvent, EventInfo } from "../../lib/common/events";
import { Evaluation } from ".";

class EvaluationEvent implements ITypedEvent<Evaluation> {
  info: EventInfo;
  constructor(public entity: Evaluation, public type: string) {
    this.info = new EventInfo(type, "Evaluation", entity.id);
  }
}

export class EvaluationCreatedEvent extends EvaluationEvent {
  public static type: string = "EvaluationCreatedEvent";
  constructor(public entity: Evaluation) {
    super(entity, EvaluationCreatedEvent.type);
  }
}

export class EvaluationUpdatedEvent extends EvaluationEvent {
  public static type: string = "EvaluationUpdatedEvent";
  constructor(public entity: Evaluation) {
    super(entity, EvaluationUpdatedEvent.type);
  }
}

export class EvaluationDeletedEvent extends EvaluationEvent {
  public static type: string = "EvaluationDeletedEvent";
  constructor(public entity: Evaluation) {
    super(entity, EvaluationDeletedEvent.type);
  }
}