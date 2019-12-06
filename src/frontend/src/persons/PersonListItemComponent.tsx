import { UIElement, Component } from "../html/index";
import { Person } from ".";

interface ListItemPersonProps {
  person: Person,
  onPersonClicked: (() => void)
  onEditClicked: (() => void),
}

class PersonListItem extends Component {
  constructor(private props: ListItemPersonProps) { super() }

  public render = (): UIElement =>
    <li
      class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
      onclick={this.props.onPersonClicked}>
      <div class="">{this.props.person.name}</div>
      <div class="ml-auto">
        <button
          class="btn btn-primary align-right"
          onclick={(event: MouseEvent) => { this.props.onEditClicked(); event.stopPropagation() }}>
          Edit
      </button>
      </div>
    </li>
}


export const PersonListItemComponent = (props: ListItemPersonProps) => new PersonListItem(props);