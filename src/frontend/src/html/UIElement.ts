const TEXT_TYPE = "TEXT";

export class UIElement {
  constructor(public type: string,
    public props: any,
    public children: UIElement[]) {
  }

  static create(type: string, props: any, ...children: UIElement[]): UIElement {
    const childrenElements = children.map(child => {
      if (typeof child === "object") {
        return child
      } else {
        return this.createText(child);
      }
    });
    return new UIElement(type, props || {}, childrenElements);
  }

  static createText(text: string): UIElement {
    return new UIElement(TEXT_TYPE, { text }, []);
  }

  createHtmlElement(): HTMLElement {
    const element = document.createElement(this.type);
    Object.keys(this.props)
      .forEach(name => {
        element.setAttribute(name, this.props[name]);
      })
    return element;
  }

  createDomElement(): HTMLElement | Text {
    const element = this.type === TEXT_TYPE ?
      document.createTextNode(this.props.text)
      : this.createHtmlElement();
    const childrenDomElements = this.children.map(child => child.createDomElement());
    childrenDomElements.forEach(child => element.appendChild(child));
    return element;
  }

}