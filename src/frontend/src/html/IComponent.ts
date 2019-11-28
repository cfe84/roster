import { UIElement } from "./UIElement";

export interface IComponent {
  renderElement(): UIElement;
}