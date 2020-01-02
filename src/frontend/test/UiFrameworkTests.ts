import { UIElement } from "../src/html/UIElement";
import should from "should";
import * as td from "testdouble";
import { Component } from "../src/html";
import { IDisplayAdapter } from "../src/html/IDisplayAdapter";

class CustomComponent extends Component {
  constructor(private element: string, private props: any) { super() }
  render(): UIElement {
    return new UIElement(this.element, this.props);
  }

}

const CreateCustomComponent = (typeName: string) =>
  (props: any) => {
    return new CustomComponent(typeName, props);
  }

describe("UI Framework", () => {
  context("UIElement", () => {
    context("Create elements", () => {
      it("should create intrinsic elements", () => {
        // given
        const elementType = "div";
        const properties = {
          name: "bdfs",
          id: "dfsgfd"
        };

        // when
        const component: Component = Component.create(elementType, properties);
        const element = (component.render as () => UIElement)();

        // then
        should(element.type).equal(elementType);
        should(element.props).deepEqual(properties);
        should(element.props.children).be.empty();
      });

      it("should create intrinsic elements with children", () => {
        // given
        const inputType = "elt1"
        const inputProps = {
          "prop1": "val1",
          "prop2": "val2"
        };
        const children: Component[] = [
          new UIElement("child1", { child1prop1: "val1.1", child1prop2: "val1.2" }),
          new UIElement("child2", { child2prop1: "val2.1", child2prop2: "val2.2" })];

        // when
        const component = Component.create(inputType, inputProps, children[0], children[1]);
        const element = (component.render as () => UIElement)();

        // then
        should(element.type).equal(inputType);
        should(element.props).equal(inputProps);
        should(element.props.children).deepEqual(children);
      });

      it("should create custom components", () => {
        // given
        const customElementType = "typeName";
        const elementType = CreateCustomComponent(customElementType);
        const properties = {
          name: "bdfs",
          id: "dfsgfd"
        };

        // when
        const component = Component.create(elementType, properties);
        const element = (component.render as () => UIElement)();

        // then
        should(element.type).equal(customElementType);
        should(element.props).deepEqual(properties);
        should(element.props.children).be.empty();
      });

      it("should render asynchronous elements", async () => {
        // given
        class asyncComponent extends Component {
          render = async (): Promise<UIElement> => {
            return new UIElement("async-element", { prop1: "prop1" });
          }
        }

        // when
        const element = new UIElement("main", {
          children: [new asyncComponent()],
          name: "name-1"
        });
        const rendered = await Promise.resolve(element.render());

        // then
        should(rendered.type).equal("main");
        should(rendered.props.name).equal("name-1");
        should(rendered.props.children[0]).match((child: UIElement) => {
          child.type === "async-element" && child.props["prop1"] === "prop1"
        });
      });
    });

    context("Render DOM object", () => {
      it("should render DOM objects", async () => {
        // given
        const type = "div";
        const child1 = new UIElement("TEXT", { "text": "test1" });
        const child2 = new UIElement("p", { "id": "id-2" });
        const props = {
          id: "id-1",
          name: "name-1",
          children: [child1, child2]
        };
        const fakeDisplayAdapter = td.object(["createTextNode", "createElement"]) as IDisplayAdapter;
        const fakeElement = td.object(["setAttribute", "appendChild"]);
        const fakeP = td.object(["setAttribute"]);
        const fakeTextNode = {};
        td.when(fakeDisplayAdapter.createTextNode("test1")).thenReturn(fakeTextNode);
        td.when(fakeDisplayAdapter.createElement("p")).thenReturn(fakeP);
        td.when(fakeDisplayAdapter.createElement(type)).thenReturn(fakeElement);
        const element = new UIElement(type, props);

        // when
        const dom = await element.createNodeAsync(fakeDisplayAdapter);

        // then
        should(dom).equal(fakeElement);
        td.verify(fakeElement.setAttribute("id", "id-1"));
        td.verify(fakeElement.setAttribute("name", "name-1"));
        td.verify(fakeElement.appendChild(fakeTextNode));
        td.verify(fakeElement.appendChild(fakeP));
        td.verify(fakeP.setAttribute("id", "id-2"));
      });

      it("should render array children", async () => {
        // given
        const type = "div";
        const child1 = new UIElement("TEXT", { "text": "test1" });
        const child2 = new UIElement("TEXT", { "text": "test2" });
        const props = {
          id: "id-1",
          children: [[child1, child2]]
        };
        const fakeDisplayAdapter = td.object(["createTextNode", "createElement"]) as IDisplayAdapter;
        const fakeElement = td.object(["setAttribute", "appendChild"]);
        const fakeTextNode1 = {};
        const fakeTextNode2 = {};
        td.when(fakeDisplayAdapter.createTextNode("test1")).thenReturn(fakeTextNode1);
        td.when(fakeDisplayAdapter.createTextNode("test2")).thenReturn(fakeTextNode2);
        td.when(fakeDisplayAdapter.createElement(type)).thenReturn(fakeElement);
        const element = new UIElement(type, props);

        // when
        const dom = await element.createNodeAsync(fakeDisplayAdapter);

        // then
        should(dom).equal(fakeElement);
        td.verify(fakeElement.setAttribute("id", "id-1"));
        td.verify(fakeElement.appendChild(fakeTextNode1));
        td.verify(fakeElement.appendChild(fakeTextNode2));
      })

      it("should render eventhandlers as functions", async () => {
        // given
        const type = "div";
        const handler = () => { };
        const props = {
          id: "id-1",
          onstuff: handler,
          children: []
        };
        const fakeDisplayAdapter = td.object(["createTextNode", "createElement"]) as IDisplayAdapter;
        const fakeElement = td.object(["setAttribute", "setProperty"]);
        td.when(fakeDisplayAdapter.createElement(type)).thenReturn(fakeElement);
        const element = new UIElement(type, props);

        // when
        const dom = await element.createNodeAsync(fakeDisplayAdapter);

        // then
        should(dom).equal(fakeElement);
        td.verify(fakeElement.setAttribute("id", "id-1"));
        td.verify(fakeElement.setProperty("onstuff", handler));
      });

      it.only("should update rendered DOM objects", async () => {
        // given
        const type = "div";
        const textChild = new UIElement("TEXT", { "text": "text-content" });
        const elementChild = new UIElement("element", { "id": "id-child-element" });
        const childToRemove = new UIElement("remove", {});
        const props = {
          id: "id-root",
          name: "name-root",
          children: [textChild, elementChild, childToRemove]
        };
        const fakeDisplayAdapter = td.object(["createTextNode", "createElement"]) as IDisplayAdapter;
        const fakeElement = td.object(["setAttribute", "appendChild", "removeChild"]);
        const fakeInnerElement = td.object(["setAttribute"]);
        const fakeElementToAdd = td.object(["setAttribute"]);
        const fakeElementToRemove = {};
        const fakeTextNode = td.object(["setText"]);
        td.when(fakeDisplayAdapter.createTextNode("text-content")).thenReturn(fakeTextNode);
        td.when(fakeDisplayAdapter.createElement("element")).thenReturn(fakeInnerElement);
        td.when(fakeDisplayAdapter.createElement("add")).thenReturn(fakeElementToAdd);
        td.when(fakeDisplayAdapter.createElement("remove")).thenReturn(fakeElementToRemove);
        td.when(fakeDisplayAdapter.createElement(type)).thenReturn(fakeElement);
        const element = new UIElement(type, props);

        // when
        const dom = await element.createNodeAsync(fakeDisplayAdapter);
        props.name = "name-root-modified";
        textChild.props["text"] = "text-content-updated";
        elementChild.props["id"] = "id-child-element-updated";
        props.children.splice(2, 1);
        props.children.push(new UIElement("add", { "id": "id-add" }))
        await element.updateNodeAsync();

        // then
        should(dom).equal(fakeElement);
        td.verify(fakeElement.setAttribute("id", "id-root"));
        td.verify(fakeElement.setAttribute("name", "name-root"));
        td.verify(fakeElement.setAttribute("name", "name-root-modified"));
        td.verify(fakeElement.appendChild(fakeTextNode));
        td.verify(fakeElement.appendChild(fakeInnerElement));
        td.verify(fakeElement.appendChild(fakeElementToRemove));
        td.verify(fakeElement.appendChild(fakeElementToAdd));
        td.verify(fakeElement.removeChild(fakeElementToRemove));
        td.verify(fakeInnerElement.setAttribute("id", "id-child-element"));
        td.verify(fakeInnerElement.setAttribute("id", "id-child-element-updated"));
        td.verify(fakeElementToAdd.setAttribute("id", "id-add"));
        td.verify(fakeTextNode.setText("text-content-updated"));
      });
    })
  })
})

