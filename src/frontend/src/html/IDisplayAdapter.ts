
export interface INode {
  appendChild(child: INode): void;
  removeChild(child: INode): void;
}

export interface IElement extends INode {
  setAttribute(name: string, value: string): void;
  setProperty(name: string, value: any): void;
  clear(): void;
}

export interface ITextNode extends INode {
  setText(text: string): void;
}

export interface IDisplayAdapter {
  createTextNode(text: string): ITextNode;
  createElement(type: string): IElement;
  getElementById(id: string): IElement;
}

export interface IDisplay {
  displayAdapter: IDisplayAdapter;
  container: IElement;
}