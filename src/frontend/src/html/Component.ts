import { UIElement } from ".";
import { CHILDREN_PROPS_MEMBER, TEXT_TYPE } from "./UIElement";

type UIElementConstructor = (a: any) => Component;

export abstract class Component {
  constructor() { }

  static create(type: string | UIElementConstructor, props: any, ...children: Component[]): Component {
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

  private static createText(text: string) {
    return new UIElement(TEXT_TYPE, { text });
  }

  public ondispose() { }

  public onmounted() { }

  abstract render(): UIElement | Promise<UIElement>;
}