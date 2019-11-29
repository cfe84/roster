import { UIElement } from "./UIElement";

export class UI {
  static render(element: UIElement, container: HTMLElement): void {
    const dom = element.createDomElement();
    container.innerHTML = "";
    // container.childNodes.forEach(child => child.remove());
    container.appendChild(dom);
  }
}