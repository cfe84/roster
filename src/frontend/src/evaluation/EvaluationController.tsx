import { IEvaluationStore, Evaluation } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, Component } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { EvaluationComponentFactory, EvaluationListFilterComponentOptions } from "./EvaluationComponentFactory";
import { EvaluationEventFactory } from "./EvaluationEventFactory";
import { EvaluationStoreAdapter } from "./IEvaluationStore";
import { IEvaluationCriteriaStore, EvaluationCriteria } from "../evaluationCriteria";
import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { List, ListComponent } from "../baseComponents/ListComponent";
import { EvaluationListItem } from "./EvaluationListItemComponent";
import { ObservationController } from "../observation";
import { Button } from "../baseComponents";
import { EvaluationCreatedEvent, EvaluationUpdatedEvent, EvaluationDeletedEvent } from "./EvaluationEvents";

export interface EvaluationControllerDependencies {
  evaluationStore: IEvaluationStore,
  evaluationCriteriaStore: IEvaluationCriteriaStore,
  evaluationCriteriaComponentFactory: IComponentFactory<EvaluationCriteria>,
  observationController: ObservationController,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type EvaluationFilter = (action: Evaluation) => boolean;

interface EvaluationListState {
  criteriaList: EvaluationCriteria[],
  evaluationList: Evaluation[]
}

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


  public getPeriodListComponentAsync = async (periodId: string): Promise<ListComponent<EvaluationCriteria>> => {
    const { evaluationList, criteriaList } = await this.getStateAsync(periodId);

    const state: EvaluationListState = {
      evaluationList,
      criteriaList
    }

    return this.renderPeriodListcomponentAsync(state, periodId);
  }

  public mountPeriodListComponentAsync = async (periodId: string) => {
    const state = await this.getStateAsync(periodId);
    const component = await this.renderPeriodListcomponentAsync(state, periodId);
    const enrichedComponent: Component = <div>
      <Button type="secondary" onclick={() => this.deps.uiContainer.unmountCurrent()} icon="arrow-left" text="Back" />
      {component}
    </div>
    const sub1 = this.deps.eventBus.subscribe(EvaluationCreatedEvent.type, (evt: EvaluationCreatedEvent) => state.evaluationList.push(evt.entity));
    const sub2 = this.deps.eventBus.subscribe(EvaluationUpdatedEvent.type, (evt: EvaluationUpdatedEvent) => {
      const index = state.evaluationList.findIndex((item) => item.id === evt.entity.id);
      state.evaluationList[index] = evt.entity;
    });
    const sub3 = this.deps.eventBus.subscribe(EvaluationDeletedEvent.type, (evt: EvaluationDeletedEvent) => {
      const index = state.evaluationList.findIndex((item) => item.id === evt.entity.id);
      state.evaluationList.splice(index);
    });
    enrichedComponent.ondispose = () => {
      this.deps.eventBus.unsubscribe(sub1);
      this.deps.eventBus.unsubscribe(sub2);
      this.deps.eventBus.unsubscribe(sub3);
    }
    this.deps.uiContainer.mount(enrichedComponent);
  }

  private renderPeriodListcomponentAsync(state: EvaluationListState, periodId: string) {
    const elementDisplay = (criteria: EvaluationCriteria) => {
      const evaluation = state.evaluationList.find((evaluation) => evaluation.criteriaId === criteria.id);
      return <EvaluationListItem evaluationCriteria={criteria} evaluation={evaluation} evaluationCriteriaComponent={(this.deps.evaluationCriteriaComponentFactory.createListItemComponent as any)(criteria)} onclick={() => {
        if (evaluation) {
          this.controller.mountView(evaluation);
        }
      }} oncreate={() => { this.controller.mountCreate(() => new Evaluation(periodId, criteria.id, criteria.title)); }} onedit={() => {
        if (evaluation) {
          this.controller.mountEdit(evaluation);
        }
      }} />;
    };
    const listComponent = <List elements={state.criteriaList} elementDisplay={elementDisplay} title="Evaluation" titleIcon="ruler" />;
    return listComponent;
  }

  private async getStateAsync(periodId: string) {
    const evaluationList = (await this.deps.evaluationStore.getEvaluationsAsync())
      .filter((evaluation) => evaluation.periodId === periodId);
    const criteriaList = (await this.deps.evaluationCriteriaStore.getEvaluationCriteriasAsync())
      .filter((criteria) => criteria.active)
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    return { evaluationList, criteriaList };
  }
}
