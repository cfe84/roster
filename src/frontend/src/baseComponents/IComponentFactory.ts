import { Component } from "../html"

export interface IComponentFactory<T> {
  createListItemComponent(element: T): Component;
  createEditComponent(element: T, onCancel: () => void, onValidate: (entity: T) => void, onDelete: (entity: T) => void): Component;
  createReadComponent(element: T, onBack: () => void, onEdit: (entity: T) => void, onDelete: (entity: T) => void): Component;
  createCreateComponent(element: T, onCancel: () => void, onValidate: (entity: T) => void): Component;
}