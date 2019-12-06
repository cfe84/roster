
export interface INode {
  appendChild(child: INode): void;
}

export interface IElement extends INode {
  setAttribute(name: string, value: string): void;
  setProperty(name: string, value: any): void;
  clear(): void;
}

export interface ITextNode extends INode { }

export interface IDisplayAdapter {
  createTextNode(text: string): ITextNode;
  createElement(type: string): IElement;
}

export interface IScopedDisplayAdapter {
  displayAdapter: IDisplayAdapter;
  container: IElement;
}