import { UIElement } from "../html/index";
import { Component } from "../html/Component";
import { ListItemComponent } from "./ListItemComponent";
import { Button } from ".";

export interface ListProps<T> {
  elements: T[],
  title?: string,
  titleIcon?: string,
  elementDisplay: ((element: T) => UIElement),
  onClicked?: ((element: T) => void),
  onAddClicked?: (() => void),
  onEditClicked?: ((element: T) => void)
}

export class ListComponent<T> extends Component {
  constructor(private props: ListProps<T>) { super() }
  public render = (): UIElement => {
    const onClicked = this.props.onClicked || ((elt: T) => { })
    const onEditClicked = this.props.onEditClicked || ((elt: T) => { })
    const rows = this.props.elements
      .map(element => new ListItemComponent<T>({
        elementDisplay: this.props.elementDisplay(element),
        onClicked: () => onClicked(element),
        onEditClicked: () => onEditClicked(element)
      }));

    const addButton = this.props.onAddClicked ? <Button onclick={this.props.onAddClicked} icon="plus" text="Add" /> : ""
    const titleIconClass = `fa fa-${this.props.titleIcon}`;
    const titleIconComponent = this.props.titleIcon ? <i class={titleIconClass}></i> : "";
    const titleComponent = this.props.title ? <h3 class="text-center">{titleIconComponent} {this.props.title}</h3> : "";

    return <div>
      {titleComponent}
      <ul class="list-group flex-column" id="elements">
        {rows}
      </ul>
      <br />
      {addButton}
    </div>;
  }
}

export function List<T>(props: ListProps<T>) { return new ListComponent(props) }

