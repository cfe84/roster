import { UIElement } from "./UIElement";
import { Component } from ".";
import { IScopedDisplayAdapter, IElement, IDisplayAdapter } from "./IDisplayAdapter";

export class UIContainer {
  private container: IElement;
  private displayAdapter: IDisplayAdapter;

  constructor(adapter: IScopedDisplayAdapter) {
    this.displayAdapter = adapter.displayAdapter;
    this.container = adapter.container;
  }

  private stack: Component[] = [];
  private currentElement: Component | null = null;

  rerenderIfCurrent = (element: Component) => {
    if (this.currentElement === element) {
      this.render();
    }
  }

  render = () => {
    this.container.clear();
    if (this.currentElement === null) {
      throw Error("Can't render: no element is mounted");
    }
    const uiElement = (this.currentElement).render();
    const dom = uiElement.createNode(this.displayAdapter);
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