import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Evaluation } from ".";
import { Component } from "../html";
import { EvaluationEditor } from "./EvaluationEditorComponent";
import { EvaluationListItem } from "./EvaluationListItemComponent";
import { EvaluationReader } from "./EvaluationReaderComponent";
import { EventBus } from "../../lib/common/events";
import { EvaluationUpdatedEvent } from "./EvaluationEvents";
import { EvaluationListFilter, EvaluationToggleFilterValues } from "./EvaluationListFilterComponent";
import { FilterFunction } from "../baseComponents/GenericController";

interface EvaluationComponentFactoryProps {
  eventBus: EventBus
}

export interface EvaluationListFilterComponentOptions {
  initialToggle: EvaluationToggleFilterValues,
}

export class EvaluationComponentFactory implements IComponentFactory<Evaluation> {
  constructor(private props: EvaluationComponentFactoryProps) { }

  createListFilterComponent(onFilterChange: (filter: FilterFunction<Evaluation>) => void, filterComponentOptions?: any) {
    const filterOptions = filterComponentOptions as EvaluationListFilterComponentOptions;
    return EvaluationListFilter({
      onFilterChanged: onFilterChange,
      initialToggle: "All"
    });
  }
  createEditComponent(element: Evaluation, onCancel: () => void, onValidate: (entity: Evaluation) => void, onDelete: (entity: Evaluation) => void): Component {
    return EvaluationEditor({
      actionName: "Update",
      evaluation: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: Evaluation, onBack: () => void, onEdit: (entity: Evaluation) => void, onDelete: (entity: Evaluation) => void): Component {
    return EvaluationReader({
      evaluation: element,
      onBack,
      onDelete: () => onDelete(element),
      onEdit: () => onEdit(element),
    });
  }
  createCreateComponent(element: Evaluation, onCancel: () => void, onValidate: (entity: Evaluation) => void): Component {
    return EvaluationEditor({
      actionName: "Create",
      evaluation: element,
      onCancel,
      onValidate,
    });
  }
}