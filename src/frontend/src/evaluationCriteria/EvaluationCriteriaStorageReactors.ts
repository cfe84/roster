import { IEvaluationCriteriaStore } from "./IEvaluationCriteriaStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PersonDeletedEvent } from "../persons/PersonEvent";
import { EvaluationCriteriaCreatedEvent, EvaluationCriteriaUpdatedEvent, EvaluationCriteriaDeletedEvent } from "./EvaluationCriteriaEvents";

export class EvaluationCriteriaStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(EvaluationCriteriaCreatedEvent.type, (evt: EvaluationCriteriaCreatedEvent) => this.evaluationCriteriaStore.createEvaluationCriteriaAsync(evt.entity));
    eventBus.subscribe(EvaluationCriteriaUpdatedEvent.type, (evt: EvaluationCriteriaCreatedEvent) => this.evaluationCriteriaStore.updateEvaluationCriteriaAsync(evt.entity));
    eventBus.subscribe(EvaluationCriteriaDeletedEvent.type, (evt: EvaluationCriteriaCreatedEvent) => this.evaluationCriteriaStore.deleteEvaluationCriteriaAsync(evt.entity));
  }
  constructor(private evaluationCriteriaStore: IEvaluationCriteriaStore) { }

}