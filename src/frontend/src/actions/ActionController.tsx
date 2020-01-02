import { IActionStore, Action } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, Component } from "../html";
import { ListComponent, List } from "../baseComponents/ListComponent";

export interface ActionControllerDependencies {
  db: IActionStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type ActionFilter = (action: Action) => boolean;

export class ActionController {
  constructor(private deps: ActionControllerDependencies) { }

  public getActionListAsync = async (filter: ActionFilter) => {
    const actions = (await this.deps.db.getActionsAsync())
      .filter(filter)
      .sort((a, b) => a.dueDate > b.dueDate ? 1 : -1);
    const elementDisplay = (action: Action) =>
      <span>{action.name} ({action.responsibility})</span>;
    const listComponent: ListComponent<Action> = <List
      title="Actions"
      titleIcon="tasks"
      elements={actions}
      onAddClicked={undefined}
      onEditClicked={() => { }}
      onClicked={() => { }}
      elementDisplay={elementDisplay}
    />

    // const createdSub = this.deps.eventBus.subscribe(Action)

    return listComponent;
  }
}
