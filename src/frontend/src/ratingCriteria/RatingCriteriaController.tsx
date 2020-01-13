import { IRatingCriteriaStore, RatingCriteria } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { RatingCriteriaComponentFactory } from "./RatingCriteriaComponentFactory";
import { RatingCriteriaEventFactory } from "./RatingCriteriaEventFactory";
import { RatingCriteriaStoreAdapter } from "./IRatingCriteriaStore";

export interface RatingCriteriaControllerDependencies {
  db: IRatingCriteriaStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type RatingCriteriaFilter = (action: RatingCriteria) => boolean;

export class RatingCriteriaController {
  private controller: GenericController<RatingCriteria>;
  constructor(private deps: RatingCriteriaControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<RatingCriteria> = {
      componentFactory: new RatingCriteriaComponentFactory({ eventBus: this.deps.eventBus }),
      eventFactory: new RatingCriteriaEventFactory(),
      db: new RatingCriteriaStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getRatingCriteriaListComponentAsync = async () => {
    const sort = (a: RatingCriteria, b: RatingCriteria) => a.title > b.title ? 1 : -1;
    const generator = () => new RatingCriteria();
    return await this.controller.getListAsync({
      entityGenerator: generator,
      sort,
      icon: "tasks",
      title: "RatingCriterias"
    });
  }
}
