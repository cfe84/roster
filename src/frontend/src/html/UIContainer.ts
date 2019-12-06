import { UIElement } from "./UIElement";
import { Component } from ".";
import { IDisplay, IElement, IDisplayAdapter } from "./IDisplayAdapter";

export class UIContainer {
  private container: IElement;
  public displayAdapter: IDisplayAdapter;

  constructor(adapter: IDisplay) {
    this.displayAdapter = adapter.displayAdapter;
    this.container = adapter.container;
  }

  private stack: Component[] = [];
  private currentElement: Component | null = null;

  rerenderIfCurrent = (element: Component) => {
    if (this.currentElement === element) {
      this.renderAsync();
    }
  }

  renderAsync = async (): Promise<void> => {
    this.container.clear();
    if (this.currentElement === null) {
      throw Error("Can't render: no element is mounted");
    }
    const uiElement = await Promise.resolve((this.currentElement).render());
    const dom = await uiElement.createNodeAsync(this.displayAdapter);
    this.container.appendChild(dom);
  }

  mount = (element: Component) => {
    if (this.currentElement !== null) {
      this.stack.push(this.currentElement);
    }
    this.currentElement = element;
    Promise.resolve(this.renderAsync())
      .then(this.currentElement.onmounted);
  }

  unmountCurrent = () => {
    if (this.currentElement === null) {
      throw Error("Can't unmount: no element is mounted.")
    }
    this.currentElement.ondispose();
    this.currentElement = this.stack.pop() || null;
    this.renderAsync().then(() => { });
  }
}