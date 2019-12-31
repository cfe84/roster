import { UIElement } from "../src/html";
import should from "should";
import { ButtonComponent, Button } from "../src/baseComponents";

export const findChildByType = (element: UIElement, type: any): UIElement =>
  findChildrenByType(element, type)[0];

type constructor<T> = { new(...args: any[]): T };

export const findChildrenByType = <T>(element: UIElement, type: string | constructor<T>): UIElement[] =>
  element.props?.children
    ? (
      type !== ""
        ? element.props.children.filter((child: UIElement) => child.type === type)
        : element.props.children.filter((child: UIElement) => child instanceof (type as unknown as constructor<T>))
    )
    : [];

export const findChildrenByTypeDeep = <T>(rootElement: UIElement, type: string | constructor<T>): UIElement[] =>
  findChildrenByType(rootElement, type).concat(
    rootElement.props.children
      ? (rootElement.props.children as UIElement[]).reduce((resultsInChildren, child) => resultsInChildren.concat(findChildrenByTypeDeep(child, type)), [] as UIElement[])
      : [])

describe("Component tests utils", () => {
  const createElement = (type: string) => ({ type, props: { children: [] } });
  const addChild = (element: any, child: any) => element.props.children.push(child);
  it("should find children deep into the component tree", () => {
    // given
    const tree = createElement("root");
    const tree_div = createElement("div");
    const tree_div_button = createElement("button");
    const tree_div_p = createElement("p");
    const tree_div_div = createElement("div");
    const tree_div_div_button = createElement("button");
    const tree_button = createElement("button");
    const tree_p = createElement("p");
    addChild(tree, tree_div);
    addChild(tree, tree_button);
    addChild(tree, tree_p);
    addChild(tree_div, tree_div_button);
    addChild(tree_div, tree_div_p);
    addChild(tree_div, tree_div_div);
    addChild(tree_div_div, tree_div_div_button);

    // when
    const buttons = findChildrenByTypeDeep(tree as UIElement, "button");

    // then
    should(buttons).have.length(3);
    should(buttons).containEql(tree_button);
    should(buttons).containEql(tree_div_button);
    should(buttons).containEql(tree_div_div_button);
  });

  it.skip("should find by class", () => {
    // given
    const tree = createElement("root");
    const tree_button = new ButtonComponent({ onclick: () => { }, text: "" });
    addChild(tree, tree_button);

    // when
    const children = findChildrenByTypeDeep(tree as UIElement, ButtonComponent);

    // then
    should(children).have.length(1);
    should(children).containEql(tree_button);
  })
})