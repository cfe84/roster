import { UIElement } from "./UIElement";

export class UI {
  static render(element: UIElement, container: HTMLElement | string = "container-main"): void {
    let containerElement: HTMLElement | null;
    if (typeof container === "string") {
      const foundContainerElement = document.getElementById(container as string);
      containerElement = foundContainerElement;
    } else {
      containerElement = container as HTMLElement;
    }
    const dom = element.createDomElement();
    if (containerElement === null) {
      console.error("Container not found!");
    } else {
      containerElement.innerHTML = "";
      containerElement.appendChild(dom);
    }
  }
}