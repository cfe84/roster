import { IComponentFactory } from "../baseComponents/IComponentFactory";
import { Template } from ".";
import { Component } from "../html";
import { TemplateEditor } from "./TemplateEditorComponent";
import { TemplateListItem } from "./TemplateListItemComponent";
import { TemplateReader } from "./TemplateReaderComponent";
import { EventBus } from "../../lib/common/events";
import { TemplateUpdatedEvent } from "./TemplateEvents";
import { TemplateListFilter, TemplateToggleFilterValues } from "./TemplateListFilterComponent";
import { FilterFunction } from "../baseComponents/GenericController";

interface TemplateComponentFactoryProps {
  eventBus: EventBus
}

export interface TemplateListFilterComponentOptions {
  initialToggle: TemplateToggleFilterValues,
}

export class TemplateComponentFactory implements IComponentFactory<Template> {
  constructor(private props: TemplateComponentFactoryProps) { }


  createListItemComponent(element: Template): Component {
    return TemplateListItem({
      template: element
    });
  }
  createListFilterComponent(onFilterChange: (filter: FilterFunction<Template>) => void, filterComponentOptions?: any) {
    const filterOptions = filterComponentOptions as TemplateListFilterComponentOptions;
    return TemplateListFilter({
      onFilterChanged: onFilterChange,
      initialToggle: "All"
    });
  }
  createEditComponent(element: Template, onCancel: () => void, onValidate: (entity: Template) => void, onDelete: (entity: Template) => void): Component {
    return TemplateEditor({
      actionName: "Update",
      template: element,
      onCancel,
      onValidate,
    });
  }
  createReadComponent(element: Template, onBack: () => void, onEdit: (entity: Template) => void, onDelete: (entity: Template) => void): Component {
    return TemplateReader({
      template: element,
      onBack,
      onDelete,
      onEdit,
    });
  }
  createCreateComponent(element: Template, onCancel: () => void, onValidate: (entity: Template) => void): Component {
    return TemplateEditor({
      actionName: "Create",
      template: element,
      onCancel,
      onValidate,
    });
  }
}