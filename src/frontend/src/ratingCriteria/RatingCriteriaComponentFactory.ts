import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { RatingCriteria } from ".";
import { Component } from "../html";
import { RatingCriteriaEditor } from "./RatingCriteriaEditorComponent";
import { RatingCriteriaListItem } from "./RatingCriteriaListItemComponent";
import { RatingCriteriaReader } from "./RatingCriteriaReaderComponent";
import { EventBus } from "../../lib/common/events";
import { RatingCriteriaUpdatedEvent } from "./RatingCriteriaEvents";

interface RatingCriteriaComponentFactoryProps {
  eventBus: EventBus
}

export class RatingCriteriaComponentFactory implements IComponentFactory<RatingCriteria> {
  constructor(private props: RatingCriteriaComponentFactoryProps) { }


  createListItemComponent(element: RatingCriteria): Component {
    return RatingCriteriaListItem({
      ratingCriteria: element
    });
  }
  createEditComponent(element: RatingCriteria, onCancel: () => void, onValidate: (entity: RatingCriteria) => void, onDelete: (entity: RatingCriteria) => void): Component {
    return RatingCriteriaEditor({
      ratingCriteriaName: "Update",
      ratingCriteria: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: RatingCriteria, onBack: () => void, onEdit: (entity: RatingCriteria) => void, onDelete: (entity: RatingCriteria) => void): Component {
    return RatingCriteriaReader({
      ratingCriteria: element,
      onBack,
      onDelete: () => onDelete(element),
      onEdit: () => onEdit(element),
    });
  }
  createCreateComponent(element: RatingCriteria, onCancel: () => void, onValidate: (entity: RatingCriteria) => void): Component {
    return RatingCriteriaEditor({
      ratingCriteriaName: "Create",
      ratingCriteria: element,
      onCancel,
      onValidate,
    });
  }
}