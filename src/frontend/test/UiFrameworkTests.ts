import { UIElement, Document } from "../src/html/UIElement";
import should from "should";
import * as td from "testdouble";
import { Component } from "../src/html";

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
        const element = component.render();

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
        const element = component.render()

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
        const element = component.render();

        // then
        should(element.type).equal(customElementType);
        should(element.props).deepEqual(properties);
        should(element.props.children).be.empty();
      })
    });
    context.skip("Render DOM object", () => {
      it("should render simple DOM objects", () => {
        // given
        const type = "div";
        const props = {
          id: "id-1",
          name: "name-1"
        };
        const fakeDocument = td.object(["createElement"]) as Document;
        const fakeElement = td.object(["setAttribute"]);
        td.when(fakeDocument.createElement(type)).thenReturn(fakeElement);
        const element = new UIElement(type, props);

        // when
        const dom = element.createDomElement();

        // then
        td.verify(fakeElement.setAttribute("id", "id-1"));
        td.verify(fakeElement.setAttribute("name", "name-1"));
      });

      it("should render text", () => {
        // given
        throw Error("Not implemented");
      });

      it("should render children", () => {
        throw Error("Not implemented");
      })

      it("should render array children", () => {
        throw Error("Not implemented");
      })

      it("should render eventhandlers as functions", () => {
        throw Error("Not implemented");
      })
    })
  })
})

