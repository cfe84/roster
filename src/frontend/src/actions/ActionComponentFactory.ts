import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Action } from ".";
import { Component } from "../html";
import { ActionEditor } from "./ActionEditorComponent";
import { ActionListItem } from "./ActionListItemComponent";
import { ActionReader } from "./ActionReaderComponent";
import { EventBus } from "../../lib/common/events";
import { ActionUpdatedEvent } from "./ActionEvents";
import { ActionListFilter, ActionResponsibilityFilter } from "./ActionListFilterComponent";
import { FilterFunction } from "../baseComponents/GenericController";

interface ActionComponentFactoryProps {
  eventBus: EventBus
}

export interface ActionListFilterComponentOptions {
  initialResponsibility: ActionResponsibilityFilter,
  initialShowCompleted: boolean
}

export class ActionComponentFactory implements IComponentFactory<Action> {
  constructor(private props: ActionComponentFactoryProps) { }


  createListItemComponent(element: Action): Component {
    return ActionListItem({
      action: element
    });
  }
  createListFilterComponent(onFilterChange: (filter: FilterFunction<Action>) => void, filterComponentOptions?: any) {
    const filterOptions = filterComponentOptions as ActionListFilterComponentOptions;
    return ActionListFilter({
      onFilterChanged: onFilterChange,
      initialResponsibility: filterOptions?.initialResponsibility || "all",
      initialShowCompleted: filterOptions?.initialShowCompleted || false
    });
  }
  createEditComponent(element: Action, onCancel: () => void, onValidate: (entity: Action) => void, onDelete: (entity: Action) => void): Component {
    return ActionEditor({
      actionName: "Update",
      action: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: Action, onBack: () => void, onEdit: (entity: Action) => void, onDelete: (entity: Action) => void): Component {
    return ActionReader({
      action: element,
      onBack,
      onDelete: () => onDelete(element),
      onEdit: () => onEdit(element),
      onCompleteChanged: () => this.props.eventBus.publishAsync(new ActionUpdatedEvent(element)).then(() => { })
    });
  }
  createCreateComponent(element: Action, onCancel: () => void, onValidate: (entity: Action) => void): Component {
    return ActionEditor({
      actionName: "Create",
      action: element,
      onCancel,
      onValidate,
    });
  }
}