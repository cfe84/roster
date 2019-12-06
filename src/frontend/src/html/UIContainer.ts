import { UIElement } from "./UIElement";
import { Component } from ".";

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

  private stack: Component[] = [];
  private currentElement: Component | null = null;

  rerenderIfCurrent = (element: Component) => {
    if (this.currentElement === element) {
      this.render();
    }
  }

  render = () => {
    this.container.innerHTML = "";
    if (this.currentElement === null) {
      throw Error("Can't render: no element is mounted");
    }
    const uiElement = (this.currentElement).render();
    const dom = uiElement.createDomElement();
    this.container.appendChild(dom);
  }

  mount = (element: Component) => {
    if (this.currentElement !== null) {
      this.stack.push(this.currentElement);
    }
    this.currentElement = element;
    this.render();
  }

  unmountCurrent = () => {
    if (this.currentElement === null) {
      throw Error("Can't unmount: no element is mounted.")
    }
    this.currentElement.ondispose();
    this.currentElement = this.stack.pop() || null;
    this.render();
  }
}