import { UIElement } from "./UIElement";

export class UIContainer {
  private container: HTMLElement;

  private getElement = (container: HTMLElement | string): HTMLElement => {
    let containerElement: HTMLElement | null;
    if (typeof container === "string") {
      const foundContainerElement = document.getElementById(container as string);
      containerElement = foundContainerElement;
    } else {
      containerElement = container as HTMLElement;
    }
    if (containerElement === null) {
      throw Error("Container not found!");
    }
    return containerElement;
  }

  constructor(container: HTMLElement | string = "container-main") {
    this.container = this.getElement(container);
  }

  mount(element: UIElement) {
    const dom = element.createDomElement();
    this.container.innerHTML = "";
    this.container.appendChild(dom);
  }
}