import { UIElement } from "../html/index";
import { Component } from "../html/Component";
import { ListItemComponent } from "./ListItemComponent";
import { Button } from ".";
import { IEntity } from "../../lib/common/entities";

export interface ListProps<T extends IEntity> {
  elements: T[],
  title?: string,
  titleIcon?: string,
  elementDisplay: ((element: T) => UIElement | Component),
  onClicked?: ((element: T) => void),
  onAddClicked?: (() => void),
  onEditClicked?: ((element: T) => void)
}

interface ListItemReference<T extends IEntity> {
  value: T,
  component: ListItemComponent<T>;
}

export class ListComponent<T extends IEntity> extends Component {
  constructor(private props: ListProps<T>) { super() }

  private listComponent?: UIElement;
  private listItems?: ListItemReference<T>[];

  public addItemAsync = async (item: T): Promise<void> => {
    this.props.elements.push(item);
    if (this.listComponent) {
      const listItemComponent = this.mapListItem(item);
      this.listComponent.props["children"].push(listItemComponent);
      await this.listComponent.updateNodeAsync();
    }
  }

  public removeItemAsync = async (item: T): Promise<void> => {
    const index = this.props.elements.findIndex((itemInList) => itemInList === item);
    if (index < 0) {
      throw Error("Item not found: " + JSON.stringify(item));
    } else {
      this.props.elements.splice(index, 1);
      if (this.listComponent && this.listItems) {
        const listItemComponent = this.listItems.find((reference) => reference.value.id === item.id);
        const indexOfComponent = this.listComponent.props["children"].findIndex(listItemComponent);
        if (indexOfComponent < 0) {
          throw Error("Component not found in list");
        } else {
          this.listComponent.props["children"].splice(indexOfComponent, 1);
        }
        await this.listComponent.updateNodeAsync();
      }
    }
  }

  public setItemVisibilityAsync = async (item: T, visible: boolean) => {
    if (this.listItems) {
      const reference = this.listItems.find((itemInList) => itemInList.value === item);
      if (!reference) {
        throw Error("Item not found: " + JSON.stringify(item));
      } else {
        await reference.component.setVisibilityAsync(visible);
      }
    }
  }

  public updateItemsAsync = async (): Promise<void> => {
    await this.listComponent?.updateNodeAsync();
  }

  public render = (): UIElement => {
    this.listItems = this.props.elements
      .map((item) => ({
        value: item,
        component: this.mapListItem(item)
      }));

    const addButton = this.props.onAddClicked ? <Button onclick={this.props.onAddClicked} icon="plus" text="Add" /> : ""
    const titleIconClass = `fa fa-${this.props.titleIcon}`;
    const titleIconComponent = this.props.titleIcon ? <i class={titleIconClass}></i> : "";
    const titleComponent = this.props.title ? <h3 class="text-center">{titleIconComponent} {this.props.title}</h3> : "";
    this.listComponent = <ul class="list-group flex-column" id="elements">
      {this.listItems.map(row => row.component)}
    </ul>;
    return <div class="mt-2 mb-2">
      {titleComponent}
      {this.listComponent}
      <br />
      {addButton}
    </div>;
  }

  private mapListItem = (item: T): ListItemComponent<T> => {
    const onClicked = this.props.onClicked !== undefined ? (() => (this.props.onClicked as any)(item)) : undefined;
    const onEditClicked = this.props.onEditClicked !== undefined ? (() => (this.props.onEditClicked as any)(item)) : undefined;
    return new ListItemComponent<T>({
      elementDisplay: this.props.elementDisplay(item),
      onClicked: onClicked,
      onEditClicked: onEditClicked
    });
  }
}

export function List<T extends IEntity>(props: ListProps<T>) { return new ListComponent(props) }

