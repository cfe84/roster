import { UIElement, IComponent } from "../html/index";

export class CreatePersonComponent implements IComponent {
  renderElement(): UIElement {
    return <p>This is my first component</p>;
  }
}