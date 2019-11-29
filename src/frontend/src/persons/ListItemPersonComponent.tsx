import { UIElement, IComponent } from "../html/index";

export const ListItemPersonComponent = (props: { name: string }): UIElement =>
  <div class="elements-list">
    {props.name}
    <button class="btn btn-primary align-right">Edit</button>
    &nbsp;
    <button class="btn btn-secondary col-auto">Delete</button>
  </div>