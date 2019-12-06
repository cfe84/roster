import { Component } from ".";
import { IDisplayAdapter, INode, IElement } from "./IDisplayAdapter";

export const TEXT_TYPE = "TEXT";
export const CHILDREN_PROPS_MEMBER = "children";

export class UIElement {
  constructor(
    public type: any,
    public props: any) {
  }

  render() { return this }

  private createElement(displayAdapter: IDisplayAdapter): IElement {
    const element = displayAdapter.createElement(this.type);
    Object.keys(this.props)
      .filter(name => name !== CHILDREN_PROPS_MEMBER)
      .forEach(name => {
        if (typeof this.props[name] === "function") {
          element.setProperty(name, this.props[name]);
        } else {
          element.setAttribute(name, this.props[name]);
        }
      })
    return element;
  }

  createNode(displayAdapter: IDisplayAdapter): INode {
    const element = this.type === TEXT_TYPE ?
      displayAdapter.createTextNode(this.props.text)
      : this.createElement(displayAdapter);
    const children = (this.props.children as (Component | Component[])[]) || [];
    const childrenDomElements = children
      .reduce((res: Component[], child: Component | Component[]) => {
        if (Array.isArray(child)) {
          return res.concat(child as Component[]);
        } else {
          res.push(child as Component);
          return res;
        }
      }
        , [])
      .map(child => child.render().createNode(displayAdapter));
    childrenDomElements.forEach(child => element.appendChild(child));
    return element;
  }

  ondispose() { }

}