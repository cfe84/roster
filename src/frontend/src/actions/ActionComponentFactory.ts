import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Action } from ".";
import { Component } from "../html";
import { ActionEditor } from "./ActionEditorComponent";
import { ActionListItem } from "./ActionListItemComponent";
import { ActionReader } from "./ActionReaderComponent";

export class ActionComponentFactory implements IComponentFactory<Action> {
  createListItemComponent(element: Action): Component {
    return ActionListItem({
      action: element
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
      onEdit: () => onEdit(element)
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