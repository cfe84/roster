import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { EvaluationCriteria } from ".";
import { Component } from "../html";
import { EvaluationCriteriaEditor } from "./EvaluationCriteriaEditorComponent";
import { EvaluationCriteriaListItem } from "./EvaluationCriteriaListItemComponent";
import { EvaluationCriteriaReader } from "./EvaluationCriteriaReaderComponent";
import { EventBus } from "../../lib/common/events";
import { EvaluationCriteriaUpdatedEvent } from "./EvaluationCriteriaEvents";

interface EvaluationCriteriaComponentFactoryProps {
  eventBus: EventBus
}

export class EvaluationCriteriaComponentFactory implements IComponentFactory<EvaluationCriteria> {
  constructor(private props: EvaluationCriteriaComponentFactoryProps) { }


  createListItemComponent(element: EvaluationCriteria): Component {
    return EvaluationCriteriaListItem({
      evaluationCriteria: element
    });
  }
  createEditComponent(element: EvaluationCriteria, onCancel: () => void, onValidate: (entity: EvaluationCriteria) => void, onDelete: (entity: EvaluationCriteria) => void): Component {
    return EvaluationCriteriaEditor({
      actionName: "Update",
      evaluationCriteria: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: EvaluationCriteria, onBack: () => void, onEdit: (entity: EvaluationCriteria) => void, onDelete: (entity: EvaluationCriteria) => void): Component {
    return EvaluationCriteriaReader({
      evaluationCriteria: element,
      onBack,
      onDelete: () => onDelete(element),
      onEdit: () => onEdit(element),
    });
  }
  createCreateComponent(element: EvaluationCriteria, onCancel: () => void, onValidate: (entity: EvaluationCriteria) => void): Component {
    return EvaluationCriteriaEditor({
      actionName: "Create",
      evaluationCriteria: element,
      onCancel,
      onValidate,
    });
  }
}