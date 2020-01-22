import { UIElement } from ".";
import { CHILDREN_PROPS_MEMBER, TEXT_NODE_TYPE } from "./UIElement";

type UIElementConstructor = (a: any) => Component;

export abstract class Component {
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
    return new UIElement(TEXT_NODE_TYPE, { text: (text !== null && text !== undefined) ? text : "" });
  }

  public ondispose() { }

  public onmounted() { }

  public on(eventType: string, eventData: any) { }

  abstract render(): UIElement | Promise<UIElement>;
}