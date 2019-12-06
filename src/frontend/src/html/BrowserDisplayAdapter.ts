import { IElement, IDisplayAdapter, ITextNode, INode, IScopedDisplayAdapter } from "./IDisplayAdapter";

interface IBrowserNode extends INode {
  getNode(): Node;
}

class BrowserHtmlElement implements IElement, IBrowserNode {
  private element: HTMLElement;

  public static getElement = (container: HTMLElement | string = "container-main"): BrowserHtmlElement => {
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
    return new BrowserHtmlElement(containerElement);
  }

  public static createElement(type: string): BrowserHtmlElement {
    const element = document.createElement(type);
    return new BrowserHtmlElement(element);
  }

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public setAttribute(name: string, value: string): void {
    this.element.setAttribute(name, value);
  }

  public setProperty(name: string, value: any): void {
    (this.element as any)[name] = value;
  }

  public clear(): void {
    this.element.innerHTML = "";
  }

  public appendChild(child: INode) {
    this.element.appendChild((child as IBrowserNode).getNode());
  }

  public getNode = (): Node => this.element;
}

class BrowserTextNode implements ITextNode, IBrowserNode {
  private node: Text;
  constructor(text: string) {
    this.node = document.createTextNode(text);
  }
  public appendChild(child: INode) {
    this.node.appendChild((child as IBrowserNode).getNode());
  }
  public getNode = (): Node => this.node;

}

export class BrowserDisplayAdapter implements IDisplayAdapter {
  public createTextNode(text: string): ITextNode {
    return new BrowserTextNode(text);
  }
  public createElement(type: string): IElement {
    return BrowserHtmlElement.createElement(type);
  }
  public getElementFromDom = BrowserHtmlElement.getElement;
}