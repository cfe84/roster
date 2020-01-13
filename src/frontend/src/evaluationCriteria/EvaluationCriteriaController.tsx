import { IEvaluationCriteriaStore, EvaluationCriteria } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { EvaluationCriteriaComponentFactory } from "./EvaluationCriteriaComponentFactory";
import { EvaluationCriteriaEventFactory } from "./EvaluationCriteriaEventFactory";
import { EvaluationCriteriaStoreAdapter } from "./IEvaluationCriteriaStore";

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

  public getEvaluationCriteriaListComponentAsync = async () => {
    const sort = (a: EvaluationCriteria, b: EvaluationCriteria) => a.title > b.title ? 1 : -1;
    const generator = () => new EvaluationCriteria();
    return await this.controller.getListAsync({
      entityGenerator: generator,
      sort,
      icon: "tasks",
      title: "EvaluationCriterias"
    });
  }
}
