import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Period } from ".";
import { Component } from "../html";
import { PeriodEditor } from "./PeriodEditorComponent";
import { PeriodListItem } from "./PeriodListItemComponent";
import { PeriodReader } from "./PeriodReaderComponent";
import { EventBus } from "../../lib/common/events";
import { PeriodUpdatedEvent } from "./PeriodEvents";
import { PeriodListFilter, PeriodToggleFilterValues } from "./PeriodListFilterComponent";
import { FilterFunction } from "../baseComponents/GenericController";
import { EvaluationCriteriaController } from "../evaluationCriteria";
import { ObservationController } from "../observation";
import { EvaluationController } from "../evaluation";

interface PeriodComponentFactoryProps {
  eventBus: EventBus,
  evaluationCriteriaController: EvaluationCriteriaController,
  observationController: ObservationController,
  evalutionController: EvaluationController
}

export interface PeriodListFilterComponentOptions {
  initialToggle: PeriodToggleFilterValues,
}

export class PeriodComponentFactory implements IComponentFactory<Period> {
  constructor(private props: PeriodComponentFactoryProps) { }


  createListItemComponent(element: Period): Component {
    return PeriodListItem({
      period: element
    });
  }
  createListFilterComponent(onFilterChange: (filter: FilterFunction<Period>) => void, filterComponentOptions?: any) {
    const filterOptions = filterComponentOptions as PeriodListFilterComponentOptions;
    return PeriodListFilter({
      onFilterChanged: onFilterChange,
      initialToggle: "All"
    });
  }
  createEditComponent(element: Period, onCancel: () => void, onValidate: (entity: Period) => void, onDelete: (entity: Period) => void): Component {
    return PeriodEditor({
      periodName: "Update",
      period: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: Period, onBack: () => void, onEdit: (entity: Period) => void, onDelete: (entity: Period) => void): Component {
    return PeriodReader({
      period: element,
      onBack,
      onDelete,
      onEdit,
      onCompleteChanged: () => this.props.eventBus.publishAsync(new PeriodUpdatedEvent(element)).then(() => { }),
      evaluationCriteriaController: this.props.evaluationCriteriaController,
      evaluationController: this.props.evalutionController,
      observationController: this.props.observationController
    });
  }
  createCreateComponent(element: Period, onCancel: () => void, onValidate: (entity: Period) => void): Component {
    return PeriodEditor({
      periodName: "Create",
      period: element,
      onCancel,
      onValidate,
    });
  }
}