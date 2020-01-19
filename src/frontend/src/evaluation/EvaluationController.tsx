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

export interface EvaluationControllerDependencies {
  evaluationStore: IEvaluationStore,
  evaluationCriteriaStore: IEvaluationCriteriaStore,
  evaluationCriteriaComponentFactory: IComponentFactory<EvaluationCriteria>,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type EvaluationFilter = (action: Evaluation) => boolean;

export class EvaluationController {
  private controller: GenericController<Evaluation>;
  constructor(private deps: EvaluationControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Evaluation> = {
      componentFactory: new EvaluationComponentFactory({ eventBus: this.deps.eventBus }),
      eventFactory: new EvaluationEventFactory(),
      db: new EvaluationStoreAdapter(deps.evaluationStore),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getPeriodListComponentAsync = async (periodId: string) => {
    return await this.getEvaluationListComponentAsync((evaluation: Evaluation) => evaluation.periodId === periodId, periodId);
  }

  private getEvaluationListComponentAsync = async (filter: EvaluationFilter, periodId?: string) => {
    const criteriaList = (await this.deps.evaluationCriteriaStore.getEvaluationCriteriasAsync())
      .filter((criteria) => criteria.active)
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    const elementDisplay = (criteria: EvaluationCriteria) => <EvaluationListItem
      evaluationCriteria={criteria}
      evaluationCriteriaComponent={(this.deps.evaluationCriteriaComponentFactory.createListItemComponent as any)(criteria)}
      onclick={() => { }}
      oncreate={() => { }}
      onedit={() => { }}
    />
    const listComponent = <List
      elements={criteriaList}
      elementDisplay={elementDisplay}
      title="Evaluation"
      titleIcon="ruler"
    />
    return listComponent;
  }
}
