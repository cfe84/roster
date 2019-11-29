import { UIElement } from "../html/index";

export const ListItemPersonComponent = (props: { name: string }): UIElement =>
  <li class="w-100 d-flex align-items-center list-group-item  list-group-item-action">
    <div class="">{props.name}</div>
    <div class="ml-auto">
      <button class="btn btn-primary align-right">Edit</button>
      &nbsp;
      <button class="btn btn-secondary">Delete</button>
    </div>
  </li>