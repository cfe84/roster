import { IEvaluationStore, Evaluation } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, Component } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { EvaluationComponentFactory, EvaluationListFilterComponentOptions } from "./EvaluationComponentFactory";
import { EvaluationEventFactory } from "./EvaluationEventFactory";
import { EvaluationStoreAdapter } from "./IEvaluationStore";
import { IEvaluationCriteriaStore, EvaluationCriteria } from "../evaluationCriteria";
import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { List } from "../baseComponents/ListComponent";
import { EvaluationListItem } from "./EvaluationListItemComponent";
import { ObservationController } from "../observation";
import { Button } from "../baseComponents";

export interface EvaluationControllerDependencies {
  evaluationStore: IEvaluationStore,
  evaluationCriteriaStore: IEvaluationCriteriaStore,
  evaluationCriteriaComponentFactory: IComponentFactory<EvaluationCriteria>,
  observationController: ObservationController,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type EvaluationFilter = (action: Evaluation) => boolean;

export class EvaluationController {
  private controller: GenericController<Evaluation>;
  constructor(private deps: EvaluationControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Evaluation> = {
      componentFactory: new EvaluationComponentFactory({
        eventBus: this.deps.eventBus,
        evaluationCriteriaStore: this.deps.evaluationCriteriaStore,
        observationController: this.deps.observationController
      }),
      eventFactory: new EvaluationEventFactory(),
      db: new EvaluationStoreAdapter(deps.evaluationStore),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }


  public getPeriodListComponentAsync = async (periodId: string) => {
    const evaluationList = (await this.deps.evaluationStore.getEvaluationsAsync())
      .filter((evaluation) => evaluation.periodId === periodId);
    const criteriaList = (await this.deps.evaluationCriteriaStore.getEvaluationCriteriasAsync())
      .filter((criteria) => criteria.active)
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    const elementDisplay = (criteria: EvaluationCriteria) => {
      const evaluation = evaluationList.find((evaluation) => evaluation.criteriaId === criteria.id);
      return <EvaluationListItem
        evaluationCriteria={criteria}
        evaluation={evaluation}
        evaluationCriteriaComponent={(this.deps.evaluationCriteriaComponentFactory.createListItemComponent as any)(criteria)}
        onclick={() => { if (evaluation) { this.controller.mountView(evaluation) } }}
        oncreate={() => { this.controller.mountCreate(() => new Evaluation(periodId, criteria.id, criteria.title)) }}
        onedit={() => { if (evaluation) { this.controller.mountEdit(evaluation) } }}
      />
    }
    const listComponent = <List
      elements={criteriaList}
      elementDisplay={elementDisplay}
      title="Evaluation"
      titleIcon="ruler"
    />
    return listComponent;
  }

  public mountPeriodListComponentAsync = async (periodId: string) => {
    const component = await this.getPeriodListComponentAsync(periodId);
    const enrichedComponent = <div>
      <Button type="secondary" onclick={() => this.deps.uiContainer.unmountCurrent()} icon="arrow-left" text="Back" />
      {component}
    </div>
    this.deps.uiContainer.mount(enrichedComponent);
  }
}
