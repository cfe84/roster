import { IEvaluationCriteriaStore, EvaluationCriteria, EvaluationCriteriaId } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, Component } from "../html";
import { GenericController, GenericControllerDependencies, FilterFunction } from "../baseComponents/GenericController";
import { EvaluationCriteriaComponentFactory } from "./EvaluationCriteriaComponentFactory";
import { EvaluationCriteriaEventFactory } from "./EvaluationCriteriaEventFactory";
import { EvaluationCriteriaStoreAdapter } from "./IEvaluationCriteriaStore";
import { IListComponent } from "../baseComponents/IComponentFactory";
import { List } from "../baseComponents/ListComponent";
import { Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

export interface EvaluationCriteriaControllerDependencies {
  db: IEvaluationCriteriaStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type EvaluationCriteriaFilter = (action: EvaluationCriteria) => boolean;

export class EvaluationCriteriaController {
  private controller: GenericController<EvaluationCriteria>;
  constructor(private deps: EvaluationCriteriaControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<EvaluationCriteria> = {
      componentFactory: new EvaluationCriteriaComponentFactory({ eventBus: this.deps.eventBus }),
      eventFactory: new EvaluationCriteriaEventFactory(),
      db: new EvaluationCriteriaStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getEvaluationCriteriaListComponentAsync = async (filter?: FilterFunction<EvaluationCriteria>, readonly: boolean = false) => {
    const sort = (a: EvaluationCriteria, b: EvaluationCriteria) => a.title > b.title ? 1 : -1;
    const generator = () => new EvaluationCriteria();
    return await this.controller.getListAsync({
      entityGenerator: readonly ? undefined : generator,
      sort,
      filter,
      icon: "balance-scale-left",
      title: "Evaluation Criterias"
    });
  }

  public getEvaluationCriteriaSelectorComponentAsync = async (selectedCriteria: EvaluationCriteriaId[],
    onSelectionChanged: (ids: EvaluationCriteriaId[]) => void): Promise<IListComponent<EvaluationCriteria>> => {
    selectedCriteria = objectUtils.clone(selectedCriteria);
    let elements = (await this.deps.db.getEvaluationCriteriasAsync())
      .filter(criteria => criteria.active)
      .sort((a, b) => a.title < b.title ? -1 : 1);
    const onChange = (id: EvaluationCriteriaId, checked: boolean) => {
      const index = selectedCriteria.indexOf(id);
      if (index < 0 && checked) {
        selectedCriteria.push(id);
      } else if (index >= 0 && !checked) {
        selectedCriteria.splice(index, 1);
      }
      onSelectionChanged(selectedCriteria)
    }
    const elementDisplay = (criteria: EvaluationCriteria) =>
      <Checkbox
        value={selectedCriteria.indexOf(criteria.id) >= 0}
        text={criteria.title}
        onchange={(selected) => onChange(criteria.id, selected)} />;
    let listComponent: IListComponent<EvaluationCriteria> = <List
      elements={elements}
      elementDisplay={elementDisplay}
    />;

    return listComponent;
  }
}
