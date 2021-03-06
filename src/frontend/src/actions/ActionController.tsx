import { IActionStore, Action } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { ActionComponentFactory, ActionListFilterComponentOptions } from "./ActionComponentFactory";
import { ActionEventFactory } from "./ActionEventFactory";
import { ActionStoreAdapter } from "./IActionStore";

export interface ActionControllerDependencies {
  db: IActionStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type ActionFilter = (action: Action) => boolean;

export class ActionController {
  private controller: GenericController<Action>;
  constructor(private deps: ActionControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Action> = {
      componentFactory: new ActionComponentFactory({ eventBus: this.deps.eventBus }),
      eventFactory: new ActionEventFactory(),
      db: new ActionStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getMyActionsListComponentAsync = async () => {
    return await this.getActionListComponentAsync((action: Action) => true, undefined);
  }

  public getPersonListComponentAsync = async (personId: string) => {
    return await this.getActionListComponentAsync((action: Action) => action.personId === personId, personId);
  }

  private getActionListComponentAsync = async (filter: ActionFilter, personId?: string) => {
    const sort = (a: Action, b: Action) => a.dueDate > b.dueDate ? 1 : -1;
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const generator = personId ? (() => new Action(personId)) : undefined;
    const filterComponentOptions: ActionListFilterComponentOptions = {
      initialResponsibility: personId ? "theirs" : "mine",
      initialShowCompleted: false
    }
    return await this.controller.getListAsync({
      entityGenerator: generator,
      filter,
      sort,
      icon: "tasks",
      title: "Actions",
      filterComponentOptions
    });
  }
}
