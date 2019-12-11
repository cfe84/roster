import { UIElement, Component } from "../html/index";

export interface ListItemProps<T> {
  elementDisplay: UIElement
  onClicked: (() => void)
  onEditClicked: (() => void),
}

export class ListItemComponent<T> extends Component {
  constructor(private props: ListItemProps<T>) { super(); }

  public render = (): UIElement => {
    const component = <li class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
      onclick={this.props.onClicked}>
      {this.props.elementDisplay}
      <div class="ml-auto">
        <button
          class="btn btn-primary align-right"
          onclick={(event: MouseEvent) => { this.props.onEditClicked(); event.stopPropagation() }}>
          <i class="fa fa-pen"></i> Edit
      </button>
      </div>
    </li>
    return component;
  }

}

export function ListItem<T>(props: ListItemProps<T>) { return new ListItemComponent(props) };