import { UIElement, Component } from "../html/index";

export interface ListItemProps<T> {
  elementDisplay: UIElement | Component
  onClicked?: (() => void)
  onEditClicked?: (() => void)
}

export class ListItemComponent<T> extends Component {
  constructor(private props: ListItemProps<T>) { super(); }

  private element?: UIElement;
  private visibile: boolean = true;

  private getClass = () => `w-100 d-${this.visibile ? "flex" : "none"} align-items-center list-group-item ${this.props.onClicked ? " list-group-item-action btn" : ""}`

  public setVisibilityAsync = async (visibile: boolean) => {
    this.visibile = visibile;
    if (this.element) {
      this.element.props.class = this.getClass();
      await this.element.updateNodeAsync();
    }
  }

  public render = (): UIElement => {
    const editButton = this.props.onEditClicked ? <div class="ml-auto">
      <button
        class="btn btn-outline-secondary align-right"
        onclick={(event: MouseEvent) => { (this.props.onEditClicked as any)(); event.stopPropagation() }}>
        <i class="fa fa-pen"></i>
      </button>
    </div> : "";
    const component = <li class={this.getClass()}
      onclick={this.props.onClicked}>
      {this.props.elementDisplay}
      {editButton}
    </li>
    this.element = component;
    return component;
  }

}

export function ListItem<T>(props: ListItemProps<T>) { return new ListItemComponent(props) };