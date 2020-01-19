import { IEvaluationStore } from "./IEvaluationStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { EvaluationCreatedEvent, EvaluationUpdatedEvent, EvaluationDeletedEvent } from "./EvaluationEvents";
import { PeriodDeletedEvent } from "../period/PeriodEvents";

export class EvaluationStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(EvaluationCreatedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.createEvaluationAsync(evt.entity));
    eventBus.subscribe(EvaluationUpdatedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.updateEvaluationAsync(evt.entity));
    eventBus.subscribe(EvaluationDeletedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.deleteEvaluationAsync(evt.entity));
    eventBus.subscribe(PeriodDeletedEvent.type, async (evt: PeriodDeletedEvent) => {
      const evaluations = (await this.evaluationStore.getEvaluationsAsync()).filter((evaluation) => evaluation.periodId === evt.entity.id);
      await Promise.all(evaluations.map((evaluation) => eventBus.publishAsync(new EvaluationDeletedEvent(evaluation))));
    });
  }
  constructor(private evaluationStore: IEvaluationStore) { }

}