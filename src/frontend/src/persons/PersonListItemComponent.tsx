import { UIElement } from "../html/index";
import { Person } from ".";

interface ListItemPersonProps {
  person: Person,
  onPersonClicked: (() => void)
  onEditClicked: (() => void),
}

export const PersonListItemComponent = (props: ListItemPersonProps): UIElement =>
  <li
    class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
    onclick={props.onPersonClicked}>
    <div class="">{props.person.name}</div>
    <div class="ml-auto">
      <button
        class="btn btn-primary align-right"
        onclick={(event: MouseEvent) => { props.onEditClicked(); event.stopPropagation() }}>
        Edit
      </button>
    </div>
  </li>