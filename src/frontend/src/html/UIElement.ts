import { Component } from ".";
import { IDisplayAdapter, INode, IElement, ITextNode } from "./IDisplayAdapter";

export const TEXT_NODE_TYPE = "TEXT";
export const CHILDREN_PROPS_MEMBER = "children";

interface ChildReference {
  component: Component;
  element: UIElement;
  node: INode;
}

export class UIElement {
  constructor(
    public type: any,
    public props: any) {
  }

  render() { return this }

  private createElement(displayAdapter: IDisplayAdapter): IElement {
    const element = displayAdapter.createElement(this.type);
    this.mapAttributesAndProperties(element);
    return element;
  }

  private mapAttributesAndProperties(element: IElement) {
    Object.keys(this.props)
      .filter(name => name !== CHILDREN_PROPS_MEMBER)
      .forEach(name => {
        if (typeof this.props[name] === "function") {
          element.setProperty(name, this.props[name]);
        }
        else {
          element.setAttribute(name, this.props[name]);
        }
      });
  }

  async createNodeAsync(displayAdapter: IDisplayAdapter): Promise<INode> {
    this.displayAdapter = displayAdapter;
    const element = this.type === TEXT_NODE_TYPE ?
      displayAdapter.createTextNode(this.props.text)
      : this.createElement(displayAdapter);
    const childrenComponents = this.getChildrenComponents();
    this.children = [];
    for (const child of childrenComponents) {
      await this.addChildAsync(child, displayAdapter, element);
    }
    this.node = element;
    return element;
  }

  private node?: INode;
  private children?: ChildReference[];
  private displayAdapter?: IDisplayAdapter;

  private async addChildAsync(child: Component, displayAdapter?: IDisplayAdapter, element?: INode) {
    if (displayAdapter && element) {
      const childElement = await child.render();
      const childNode = await childElement.createNodeAsync(displayAdapter);
      this.children?.push({
        component: child,
        element: childElement,
        node: childNode
      });
      element.appendChild(childNode);
    }
  }

  private getChildrenComponents() {
    const children = (this.props.children as (Component | Component[])[]) || [];
    const childrenComponents = children
      .reduce((res: Component[], child: Component | Component[]) => {
        if (Array.isArray(child)) {
          return res.concat(child as Component[]);
        }
        else {
          res.push(child as Component);
          return res;
        }
      }, []);
    return childrenComponents;
  }

  async updateNodeAsync(): Promise<void> {
    this.updateCurrentNode();
    const desiredChildrenComponents = this.getChildrenComponents();
    this.removeRemovedChildren(desiredChildrenComponents);
    await this.updateChildren();
    await this.addMissingChildrenAsync(desiredChildrenComponents);
  }

  private removeRemovedChildren = (desiredChildrenComponents: Component[]) => {
    const removedChildrenComponents = this.children?.filter(
      (childReference) => !desiredChildrenComponents.find(
        (childComponent) => childReference.component === childComponent));
    removedChildrenComponents?.forEach(
      (childReference) => this.node?.removeChild(childReference.node));
  }

  private addMissingChildrenAsync = async (desiredChildrenComponents: Component[]): Promise<void> => {
    if (this.children && this.displayAdapter) {
      const newChildrenComponents = desiredChildrenComponents.filter(
        (childComponent) => !this.children?.find(
          (childReference) => childReference.component === childComponent));
      await Promise.all(newChildrenComponents.map(
        (childComponent) => this.addChildAsync(childComponent, this.displayAdapter, this.node)))
    }
  }

  private updateCurrentNode() {
    if (this.node) {
      if (this.type === TEXT_NODE_TYPE) {
        const node = this.node as ITextNode;
        node.setText(this.props.text);
      }
      else {
        this.mapAttributesAndProperties(this.node as IElement);
      }
    }
  }

  private async updateChildren() {
    if (this.children) {
      await Promise.all(this.children.map((child) => child.element.updateNodeAsync()));
    }
  }

  ondispose() { }
  on(eventType: string, eventData: any) { }
  onmounted() { }
}