import { IObservationStore, Observation } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { ObservationComponentFactory, ObservationListFilterComponentOptions } from "./ObservationComponentFactory";
import { ObservationEventFactory } from "./ObservationEventFactory";
import { ObservationStoreAdapter } from "./IObservationStore";
import { EvaluationCriteriaController, EvaluationCriteriaId } from "../evaluationCriteria";
import { PeriodController, PeriodId } from "../period";

export interface ObservationControllerDependencies {
  db: IObservationStore,
  eventBus: EventBus,
  uiContainer: UIContainer,
  evaluationCriteriaController: EvaluationCriteriaController,
}

type ObservationFilter = (action: Observation) => boolean;

export class ObservationController {
  private controller: GenericController<Observation>;
  constructor(private deps: ObservationControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Observation> = {
      componentFactory: new ObservationComponentFactory({
        eventBus: this.deps.eventBus,
        evaluationCriteriaController: deps.evaluationCriteriaController
      }),
      eventFactory: new ObservationEventFactory(),
      db: new ObservationStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getCriteriaObservationListComponentAsync = async (periodId: PeriodId, criteriaId: EvaluationCriteriaId) => {
    return await this.getObservationListComponentAsync((observation: Observation) =>
      observation.periodId === periodId
      && observation.observedCriteriaIds.find((id) => criteriaId === id) !== undefined)
  }

  public getPeriodListComponentAsync = async (periodId: PeriodId) => {
    return await this.getObservationListComponentAsync((observation: Observation) => observation.periodId === periodId, periodId);
  }

  private getObservationListComponentAsync = async (filter: ObservationFilter, periodId?: PeriodId) => {
    const generator = periodId ? (() => new Observation(periodId)) : undefined;
    const filterComponentOptions: ObservationListFilterComponentOptions = {
      initialToggle: "Unattributed",
    }
    return await this.controller.getListAsync({
      entityGenerator: generator,
      filter,
      icon: "microscope",
      title: "Observations",
      filterComponentOptions
    });
  }
}
