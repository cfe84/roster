import { UIElement } from "./UIElement";

export class UI {
  static render(element: UIElement, container: HTMLElement): void {
    const dom = element.createDomElement();
    container.innerHTML = "";
    container.appendChild(dom);
  }
}