import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Observation } from ".";
import { Component } from "../html";
import { ObservationEditor } from "./ObservationEditorComponent";
import { ObservationListItem } from "./ObservationListItemComponent";
import { ObservationReader } from "./ObservationReaderComponent";
import { EventBus } from "../../lib/common/events";
import { ObservationListFilter, ObservationToggleFilterValues } from "./ObservationListFilterComponent";
import { FilterFunction } from "../baseComponents/GenericController";
import { EvaluationCriteriaController } from "../evaluationCriteria";

interface ObservationComponentFactoryProps {
  eventBus: EventBus,
  evaluationCriteriaController: EvaluationCriteriaController
}

export interface ObservationListFilterComponentOptions {
  initialToggle: ObservationToggleFilterValues,
}

export class ObservationComponentFactory implements IComponentFactory<Observation> {
  constructor(private props: ObservationComponentFactoryProps) { }


  createListItemComponent(element: Observation): Component {
    return ObservationListItem({
      observation: element
    });
  }
  createListFilterComponent(onFilterChange: (filter: FilterFunction<Observation>) => void, filterComponentOptions?: any) {
    const filterOptions = filterComponentOptions as ObservationListFilterComponentOptions;
    return ObservationListFilter({
      onFilterChanged: onFilterChange,
      initialToggle: "All"
    });
  }
  createEditComponent(element: Observation, onCancel: () => void, onValidate: (entity: Observation) => void, onDelete: (entity: Observation) => void): Component {
    return ObservationEditor({
      observationName: "Update",
      observation: element,
      onCancel,
      onValidate,
      evaluationCriteriaController: this.props.evaluationCriteriaController
    });
  }
  createReadComponent(element: Observation, onBack: () => void, onEdit: (entity: Observation) => void, onDelete: (entity: Observation) => void): Component {
    return ObservationReader({
      observation: element,
      onBack,
      onDelete: () => onDelete(element),
      onEdit: () => onEdit(element),
      evaluationCriteriaController: this.props.evaluationCriteriaController
    });
  }
  createCreateComponent(element: Observation, onCancel: () => void, onValidate: (entity: Observation) => void): Component {
    return ObservationEditor({
      observationName: "Create",
      observation: element,
      onCancel,
      onValidate,
      evaluationCriteriaController: this.props.evaluationCriteriaController
    });
  }
}