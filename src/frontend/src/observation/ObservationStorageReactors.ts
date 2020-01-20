import { IObservationStore } from "./IObservationStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PersonDeletedEvent } from "../persons/PersonEvent";
import { ObservationCreatedEvent, ObservationUpdatedEvent, ObservationDeletedEvent } from "./ObservationEvents";
import { PeriodDeletedEvent } from "../period/PeriodEvents";
import { EvaluationCriteriaDeletedEvent } from "../evaluationCriteria/EvaluationCriteriaEvents";
import { EvaluationDeletedEvent } from "../evaluation/EvaluationEvents";

export class ObservationStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(ObservationCreatedEvent.type, (evt: ObservationCreatedEvent) => this.observationStore.createObservationAsync(evt.entity));
    eventBus.subscribe(ObservationUpdatedEvent.type, (evt: ObservationCreatedEvent) => this.observationStore.updateObservationAsync(evt.entity));
    eventBus.subscribe(ObservationDeletedEvent.type, (evt: ObservationCreatedEvent) => this.observationStore.deleteObservationAsync(evt.entity));
    eventBus.subscribe(PeriodDeletedEvent.type, async (evt: PeriodDeletedEvent) => {
      const observations = (await this.observationStore.getObservationsAsync()).filter((observation) => observation.periodId === evt.entity.id);
      await Promise.all(observations.map((observation) => eventBus.publishAsync(new ObservationDeletedEvent(observation))));
    });
    // eventBus.subscribe(EvaluationDeletedEvent.type, async (evt: EvaluationDeletedEvent) => {
    //   const observations = (await this.observationStore.getObservationsAsync()).filter((observation) =>
    //     !!observation.observedCriteriaIds.find(id => id === evt.entity.id));
    //   await Promise.all(observations.map((observation) => {
    //     const index = observation.observedCriteriaIds.findIndex((id) => id === evt.entity.id);
    //     observation.observedCriteriaIds.splice(index, 1);
    //     eventBus.publishAsync(new ObservationUpdatedEvent(observation))
    //   }
    //   ));
    // });
  }
  constructor(private observationStore: IObservationStore) { }

}