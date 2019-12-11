import { UIElement } from "../html/index";
import { Component } from "../html/Component";
import { ListItemComponent } from "./ListItemComponent";
import { Button } from ".";

interface ListProps<T> {
  elements: T[],
  elementDisplay: ((element: T) => UIElement),
  onClicked: ((element: T) => void),
  onAddClicked: (() => void),
  onEditClicked: ((element: T) => void)
}

export class ListComponent<T> extends Component {
  constructor(private props: ListProps<T>) { super() }
  public render = (): UIElement => {
    const rows = this.props.elements
      .map(element => new ListItemComponent<T>({
        elementDisplay: this.props.elementDisplay(element),
        onClicked: () => this.props.onClicked(element),
        onEditClicked: () => this.props.onEditClicked(element)
      }));

    return <div>
      <ul class="list-group flex-column" id="elements">
        {rows}
      </ul>
      <br />
      <Button onclick={this.props.onAddClicked} icon="plus" text="Add" />
    </div>;
  }
}

export function List<T>(props: ListProps<T>) { return new ListComponent(props) }

