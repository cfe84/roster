import { IObservationStore, Observation } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, Component } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { ObservationComponentFactory, ObservationListFilterComponentOptions } from "./ObservationComponentFactory";
import { ObservationEventFactory } from "./ObservationEventFactory";
import { ObservationStoreAdapter } from "./IObservationStore";
import { EvaluationCriteriaController, EvaluationCriteriaId } from "../evaluationCriteria";
import { PeriodController, PeriodId } from "../period";
import { List } from "../baseComponents/ListComponent";
import { Caption, DateDisplay, TextDisplay } from "../baseComponents";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";

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
    const elementDisplay = (observation: Observation) => <div>
      <span class="row">
        <span class="col"><TextDisplay caption="Summary" value={observation.title} /></span>
        <span class="col"><DateDisplay caption="Date" value={observation.date} /></span>
      </span>
      <MarkdownDisplay caption="Observation" value={observation.details} />
    </div>
    const elements = (await this.deps.db.getObservationsAsync()).filter((observation) => observation.periodId === periodId
      && observation.observedCriteriaIds.find((id) => criteriaId === id) !== undefined)
      .sort((a1, a2) => a1.date.getTime() - a2.date.getTime());
    const list = <List
      elementDisplay={elementDisplay}
      elements={elements}
      title="Related observations"
      titleIcon="microscope"
    />;
    return list
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
