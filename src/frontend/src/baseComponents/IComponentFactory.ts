import { Component } from "../html"
import { FilterFunction, SortFunction } from "./GenericController";

export interface IListComponent<T> extends Component {
  addItemAsync(element: T): Promise<void>;
  removeItemAsync(element: T): Promise<void>;
  updateItemsAsync(): Promise<void>;
  setItemVisibilityAsync(item: T, visibile: boolean): Promise<void>;
}

export interface IComponentFactory<T> {
  createListFilterComponent?(onFilterChange: (filter: FilterFunction<T>) => void, filterComponentOptions?: any): Component;
  createListSortComponent?(onSortChange: (sort: SortFunction<T>) => void): Component;
  createListItemComponent?(element: T): Component;
  createListComponent?(elements: T[], onAdd: () => void, onEdit: (entity: T) => void, onClicked: (entity: T) => void): IListComponent<T>;
  createEditComponent(element: T, onCancel: () => void, onValidate: (entity: T) => void, onDelete: (entity: T) => void): Component;
  createReadComponent(element: T, onBack: () => void, onEdit: (entity: T) => void, onDelete: (entity: T) => void): Component;
  createCreateComponent(element: T, onCancel: () => void, onValidate: (entity: T) => void): Component;
}