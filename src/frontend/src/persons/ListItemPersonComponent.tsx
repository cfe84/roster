import { UIElement } from "../html/index";

interface ListItemPersonProps {
  name: string,
  onEditClicked: (() => void),
  onDeleteClicked: (() => void)
}

export const ListItemPersonComponent = (props: ListItemPersonProps): UIElement =>
  <li class="w-100 d-flex align-items-center list-group-item  list-group-item-action">
    <div class="">{props.name}</div>
    <div class="ml-auto">
      <button class="btn btn-primary align-right" onclick={props.onEditClicked}>Edit</button>
      &nbsp;
      <button class="btn btn-secondary" onclick={props.onDeleteClicked}>Delete</button>
    </div>
  </li>