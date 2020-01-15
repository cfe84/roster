import { ListComponent, List } from "./ListComponent";
import { IStore } from "../storage/IStore";
import { Component, UIContainer } from "../html";
import { EventBus, IEventFactory } from "../../lib/common/events";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { ITypedEvent } from "../../lib/common/events";
import { IEntity } from "../../lib/common/entities/IEntity";
import { IComponentFactory, IListComponent } from "./IComponentFactory";

export interface GenericControllerDependencies<T> {
  db: IStore<T>,
  eventBus: EventBus,
  uiContainer: UIContainer,
  componentFactory: IComponentFactory<T>;
  eventFactory: IEventFactory<T>;
}

export type FilterFunction<T> = (element: T) => boolean;
export type SortFunction<T> = (element1: T, element2: T) => 0 | 1 | -1;
type EntityGenerator<T> = () => T;
interface GetListOptions<T> {
  filter?: FilterFunction<T>;
  sort?: SortFunction<T>;
  title?: string;
  icon?: string;
  iconClass?: string;
  entityGenerator?: EntityGenerator<T>;
  filterComponentOptions?: any;
  onItemClicked?: (item: T) => void;
}

export class GenericController<EntityType extends IEntity>{

  constructor(private deps: GenericControllerDependencies<EntityType>) { }

  public getListAsync = async (options: GetListOptions<EntityType>): Promise<IListComponent<EntityType>> => {
    let elements = (await this.deps.db.getAsync());
    let filter = options.filter ?? (() => true);
    elements = elements.filter(filter);
    if (options.sort) {
      elements = elements.sort(options.sort);
    }
    const onAdd = options.entityGenerator ? (() => { this.mountCreate(options.entityGenerator as EntityGenerator<EntityType>) }) : undefined;
    let listComponent: IListComponent<EntityType>;
    if (this.deps.componentFactory.createListItemComponent) {
      listComponent = <List
        elements={elements}
        onAddClicked={onAdd}
        onEditClicked={this.mountEdit}
        onClicked={(entity: EntityType) => { if (options.onItemClicked) { options.onItemClicked(entity) } else { this.mountView(entity) } }}
        elementDisplay={this.deps.componentFactory.createListItemComponent}
      > </List>;
    } else {
      throw Error("No list specified")
    }

    const createdSubscription = this.deps.eventBus.subscribe(this.deps.eventFactory.createdEventType,
      (evt: ITypedEvent<EntityType>) => { if (filter(evt.entity)) { listComponent.addItemAsync(evt.entity) } });
    const deletedSubscription = this.deps.eventBus.subscribe(this.deps.eventFactory.deletedEventType, (evt: ITypedEvent<EntityType>) => listComponent.removeItemAsync(evt.entity));
    const updatedSubscription = this.deps.eventBus.subscribe(this.deps.eventFactory.updatedEventType, (evt: any) => listComponent.updateItemsAsync());

    listComponent.ondispose = () => {
      createdSubscription.unsubscribe();
      deletedSubscription.unsubscribe();
      updatedSubscription.unsubscribe();
    }

    let resultComponent = listComponent;
    if (this.deps.componentFactory.createListFilterComponent) {
      const onFilterChange = (filter: FilterFunction<EntityType>) => {
        Promise.all(
          elements.map(
            (element) => listComponent.setItemVisibilityAsync(element, filter(element))))
          .then(() => { })
      }
      const filterComponent = this.deps.componentFactory.createListFilterComponent(onFilterChange, options.filterComponentOptions);
      const titleIconClass = `fa${options.iconClass || ""} fa-${options.icon}`;
      const titleIconComponent = options.icon ? <i class={titleIconClass}></i> : "";
      const titleComponent = options.title ? <h3 class="text-center">{titleIconComponent} {options.title}</h3> : "";
      resultComponent = <div>
        {titleComponent}
        {filterComponent}
        {resultComponent}
      </div>
    }

    return resultComponent;
  }

  public getCreateComponent = (entityGenerator: EntityGenerator<EntityType>): Component => {
    const entity = entityGenerator();
    const component = this.deps.componentFactory.createCreateComponent(entity,
      () => this.deps.uiContainer.unmountCurrent(),
      (entity) => {
        const event = this.deps.eventFactory.createCreatedEvent(entity);
        this.deps.eventBus.publishAsync(event)
          .then(() => this.deps.uiContainer.unmountCurrent());
      });
    return component;
  }

  public mountCreate = (entityGenerator: EntityGenerator<EntityType>) => {
    this.deps.uiContainer.mount(this.getCreateComponent(entityGenerator));
  }

  public getEditComponent(entity: EntityType) {
    const component = this.deps.componentFactory.createEditComponent(entity, () => this.deps.uiContainer.unmountCurrent(), (entity) => {
      const event = this.deps.eventFactory.createUpdatedEvent(entity);
      this.deps.eventBus.publishAsync(event).then(() => this.deps.uiContainer.unmountCurrent());
    }, (entity) => this.mountDelete(entity));
    const deletedSubscription = this.deps.eventBus.subscribe(this.deps.eventFactory.deletedEventType, () => this.deps.uiContainer.unmountCurrent());
    component.ondispose = deletedSubscription.unsubscribe
    return component;
  }

  public mountEdit = (entity: EntityType) => {
    const component = this.getEditComponent(entity);
    this.deps.uiContainer.mount(component);
  }

  public getViewComponent(entity: EntityType) {
    const component = this.deps.componentFactory.createReadComponent(entity,
      () => this.deps.uiContainer.unmountCurrent(),
      (action) => this.mountEdit(action),
      (action) => this.mountDelete(action));
    const updateSubscription = this.deps.eventBus.subscribe(this.deps.eventFactory.updatedEventType, (evt: ITypedEvent<EntityType>) => {
      if (evt.entity.id === entity.id) {
        this.deps.uiContainer.rerenderIfCurrent(component);
      }
    });
    component.ondispose = () => {
      updateSubscription.unsubscribe();
    };
    return component;
  }

  public mountView = (entity: EntityType) => {
    const component = this.getViewComponent(entity);
    this.deps.uiContainer.mount(component);
  }

  public mountDelete = (entity: EntityType): void => {
    const deleteNote = () => {
      this.deps.eventBus.publishAsync(this.deps.eventFactory.createDeletedEvent(entity))
        .then(() => this.deps.uiContainer.unmountCurrent());
    }
    const component = <ConfirmationDialog
      oncancel={this.deps.uiContainer.unmountCurrent}
      onyes={deleteNote}
      text={`Are you sure you want to delete "${entity.toString()}"?`
      }
      title="Confirm deletion" />
    this.deps.uiContainer.mount(component);
  }

}