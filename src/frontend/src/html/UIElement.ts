import { Component } from ".";

export const TEXT_TYPE = "TEXT";
export const CHILDREN_PROPS_MEMBER = "children";

export interface Document {
  createElement(type: string): any;
}

export class UIElement {
  constructor(
    public type: any,
    public props: any) {
  }

  render() { return this }

  private createHtmlElement(): HTMLElement {
    const element = document.createElement(this.type);
    Object.keys(this.props)
      .filter(name => name !== CHILDREN_PROPS_MEMBER)
      .forEach(name => {
        if (typeof this.props[name] === "function") {
          element[name] = this.props[name];
        } else {
          element.setAttribute(name, this.props[name]);
        }
      })
    return element;
  }

  createDomElement(): HTMLElement | Text {
    const element = this.type === TEXT_TYPE ?
      document.createTextNode(this.props.text)
      : this.createHtmlElement();
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
      .map(child => child.render().createDomElement());
    childrenDomElements.forEach(child => element.appendChild(child));
    return element;
  }

}