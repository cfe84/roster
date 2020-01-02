import { IElement, IDisplayAdapter, ITextNode, INode, IDisplay } from "./IDisplayAdapter";

interface IBrowserNode extends INode {
  getNode(): Node;
}

class BrowserHtmlElement implements IElement, IBrowserNode {
  private element: HTMLElement;

  public static getElement = (idOrElement: HTMLElement | string): BrowserHtmlElement => {
    let containerElement: HTMLElement | null;
    if (typeof idOrElement === "string") {
      const foundContainerElement = document.getElementById(idOrElement as string);
      containerElement = foundContainerElement;
    } else {
      containerElement = idOrElement as HTMLElement;
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
    const children = this.element.childNodes;
    children.forEach((child) => this.element.removeChild(child));
  }

  public appendChild(child: INode) {
    this.element.appendChild((child as IBrowserNode).getNode());
  }

  public removeChild(child: INode) {
    this.element.removeChild((child as IBrowserNode).getNode());
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
  public removeChild(child: INode) {
    this.node.removeChild((child as IBrowserNode).getNode());
  }
  public getNode = (): Node => this.node;
  public setText(text: string): void {
    this.node.textContent = text;
  }
}

export class BrowserDisplayAdapter implements IDisplayAdapter {
  public createTextNode(text: string): ITextNode {
    return new BrowserTextNode(text);
  }
  public createElement(type: string): IElement {
    return BrowserHtmlElement.createElement(type);
  }
  public getElementById(id: string): IElement {
    return BrowserHtmlElement.getElement(id);
  }
  public getElementFromDom = BrowserHtmlElement.getElement;
}