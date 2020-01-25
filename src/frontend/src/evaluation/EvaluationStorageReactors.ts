import { IEvaluationStore } from "./IEvaluationStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { EvaluationCreatedEvent, EvaluationUpdatedEvent, EvaluationDeletedEvent } from "./EvaluationEvents";
import { PeriodDeletedEvent } from "../period/PeriodEvents";
import { EvaluationCriteriaDeletedEvent, EvaluationCriteriaUpdatedEvent } from "../evaluationCriteria/EvaluationCriteriaEvents";

export class EvaluationStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    this.registerCRUDReactors(eventBus);
    this.registerPersonDeletionReactor(eventBus);
    this.registerCriteriaDeletionReactor(eventBus);
    this.registerCriteriaUpdatedReactor(eventBus);
  }
  constructor(private evaluationStore: IEvaluationStore) { }


  private registerCriteriaUpdatedReactor(eventBus: EventBus) {
    eventBus.subscribe(EvaluationCriteriaUpdatedEvent.type, async (evt: EvaluationCriteriaDeletedEvent) => {
      const criteria = evt.entity;
      const evaluationsForCriteria = (await this.evaluationStore.getEvaluationsAsync())
        .filter((evaluation) => evaluation.criteriaId === criteria.id);
      const evaluationWhereNameChanged = evaluationsForCriteria.filter(evaluation => {
        const criteriaNameChanged = evaluation.criteriaName !== evt.entity.title;
        const rate = criteria.rates.find(rate => rate.id === evaluation.rateId);
        const rateNameChanged = rate && rate.name !== evaluation.rateName;
        return criteriaNameChanged || rateNameChanged;
      });
      await Promise.all(evaluationWhereNameChanged.map((evaluation) => {
        evaluation.criteriaName = criteria.title;
        evaluation.rateName = criteria.rates.find(rate => rate.id === evaluation.rateId)?.name || "RATE REMOVED";
        return eventBus.publishAsync(new EvaluationUpdatedEvent(evaluation));
      }));
    });
  }

  private registerCriteriaDeletionReactor(eventBus: EventBus) {
    eventBus.subscribe(EvaluationCriteriaDeletedEvent.type, async (evt: EvaluationCriteriaDeletedEvent) => {
      const evaluations = (await this.evaluationStore.getEvaluationsAsync()).filter((evaluation) => evaluation.criteriaId === evt.entity.id);
      await Promise.all(evaluations.map((evaluation) => eventBus.publishAsync(new EvaluationDeletedEvent(evaluation))));
    });
  }

  private registerCRUDReactors(eventBus: EventBus) {
    eventBus.subscribe(EvaluationCreatedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.createEvaluationAsync(evt.entity));
    eventBus.subscribe(EvaluationUpdatedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.updateEvaluationAsync(evt.entity));
    eventBus.subscribe(EvaluationDeletedEvent.type, (evt: EvaluationCreatedEvent) => this.evaluationStore.deleteEvaluationAsync(evt.entity));
  }

  private registerPersonDeletionReactor(eventBus: EventBus) {
    eventBus.subscribe(PeriodDeletedEvent.type, async (evt: PeriodDeletedEvent) => {
      const evaluations = (await this.evaluationStore.getEvaluationsAsync()).filter((evaluation) => evaluation.periodId === evt.entity.id);
      await Promise.all(evaluations.map((evaluation) => eventBus.publishAsync(new EvaluationDeletedEvent(evaluation))));
    });
  }
}