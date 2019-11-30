const TEXT_TYPE = "TEXT";
const CHILDREN_PROPS_MEMBER = "children";
type UIElementConstructor = (a: any) => UIElement;

export interface Document {
  createElement(type: string): any;
}

export class UIElement {
  constructor(
    public type: any,
    public props: any) {
  }

  static create(type: string | UIElementConstructor, props: any, ...children: UIElement[]): UIElement {
    props = props || {};
    const childrenElements = children.map(child => {
      if (typeof child === "object") {
        return child
      } else {
        return this.createText(child);
      }
    });
    props[CHILDREN_PROPS_MEMBER] = childrenElements;
    const isIntrinsic = typeof type === "string";
    if (isIntrinsic) {
      const typeName: string = type as string;
      return new UIElement(typeName, props)
    } else {
      const componentConstructor = type as UIElementConstructor;
      return componentConstructor(props);
    }
  }

  private static createText(text: string): UIElement {
    return new UIElement(TEXT_TYPE, { text });
  }

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
    const children = (this.props.children as (UIElement | UIElement[])[]) || [];
    const childrenDomElements = children
      .reduce((res: UIElement[], child: UIElement | UIElement[]) => {
        if (Array.isArray(child)) {
          return res.concat(child as UIElement[]);
        } else {
          res.push(child as UIElement);
          return res;
        }
      }
        , [])
      .map(child => child.createDomElement());
    childrenDomElements.forEach(child => element.appendChild(child));
    return element;
  }

}