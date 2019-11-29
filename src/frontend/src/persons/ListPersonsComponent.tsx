import { UIElement, IComponent } from "../html/index";
import { ListItemPersonComponent } from "./ListItemPersonComponent";

export const ListPersonsComponent = (): UIElement =>
  <div class="elements-list vertical-center">
    <p class="mb-1">Persons</p>
    <div id="elements">
      <ListItemPersonComponent name="Paul"></ListItemPersonComponent>
      <ListItemPersonComponent name="Richard"></ListItemPersonComponent>
      <ListItemPersonComponent name="Rene"></ListItemPersonComponent>
    </div>
    <br />
    <button class="btn btn-primary">Add person</button>
  </div>