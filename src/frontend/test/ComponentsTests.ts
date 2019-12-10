import { TextInput, DateInput } from "../src/baseComponents";
import should from "should";
import { TextInputProps } from "../src/baseComponents/TextInputComponent";
import { UIElement } from "../src/html";
import * as td from "testdouble";
import { DateInputProps } from "../src/baseComponents/DateInputComponent";
import moment from "moment";
import { dateUtils } from "../src/utils/dateUtils";
import { ButtonProps, Button } from "../src/baseComponents/ButtonComponent";
import { TextDisplayComponent, TextDisplayProps, TextDisplay } from "../src/baseComponents/TextDisplayComponent";
import { MarkdownInputProps, MarkdownInput } from "../src/baseComponents/MarkdownInputComponent";

const findChildByType = (element: UIElement, type: string) =>
  element.props.children.find((child: UIElement) => child.type === type)
const findChildrenByType = (element: UIElement, type: string) =>
  element.props.children.filter((child: UIElement) => child.type === type)

describe("Common components", () => {
  const getTextInputElements = (element: UIElement): any => {
    const div = element;
    const p = findChildByType(div, "p");
    const caption = findChildByType(p, "TEXT");
    const input = findChildByType(div, "input");
    return { div, p, caption, input }
  }
  context("Text input", () => {
    context("renders base parameters", () => {
      // given
      const onchange: any = td.object("onchange");
      const props: TextInputProps = {
        class: "thisisaclass",
        caption: "this is a caption",
        placeholder: "this is a placeholder",
        value: "this is the default value",
        id: "default-id",
        onchange: onchange.onchange
      };

      // when
      const component = TextInput(props);
      const rendered = component.render();
      const elements = getTextInputElements(rendered);
      elements.input.props.onkeyup({ target: { value: "value" } });

      // then
      should(elements.div.type).equal("div");
      it("renders class",
        () => should(elements.div.props.class).containEql(props.class));
      it("displays caption",
        () => should(elements.caption.props.text).eql(props.caption));
      it("renders placeholder",
        () => { should(elements.input.props.placeholder).eql(props.placeholder) });
      it("renders value when specified directly",
        () => { should(elements.input.props.value).eql(props.value) });
      it("renders id when specified directly",
        () => { should(elements.input.props.id).eql(props.id) });
      it("renders onchange when specified directly", () => {
        td.verify(onchange.onchange("value"));
      });
    });

    it("use the object if specified", () => {
      // given
      const initialValue = "initial value";
      const newValue = "new value";
      const fieldName = "fieldname";
      const props: TextInputProps = {
        object: { "fieldname": initialValue },
        field: fieldName
      };

      // when
      const component = TextInput(props);
      const rendered = component.render();
      const elements = getTextInputElements(rendered);
      elements.input.props.onkeyup({ target: { value: newValue } });

      // then
      should((props.object as any)[fieldName]).eql(newValue);
      should(elements.input.props.value).eql(initialValue)
    });
  });
  context("Date input", () => {
    context("renders base parameters", () => {
      // given
      const onchange: any = td.object("onchange");
      const props: DateInputProps = {
        class: "thisisaclass",
        caption: "this is a caption",
        placeholder: "this is a placeholder",
        value: moment("2019-11-01").toDate(),
        id: "default-id",
        onchange: onchange.onchange
      };
      const targetDate = moment("2018-12-01");

      // when
      const component = DateInput(props);
      const rendered = component.render();
      const elements = getTextInputElements(rendered);
      elements.input.props.onkeyup({ target: { value: targetDate.format("YYYY-MM-DD") } });

      // then
      should(elements.div.type).equal("div");
      it("renders class",
        () => should(elements.div.props.class).containEql(props.class));
      it("displays caption",
        () => should(elements.caption.props.text).eql(props.caption));
      it("renders placeholder",
        () => { should(elements.input.props.placeholder).eql(props.placeholder) });
      it("renders date when specified directly, using correct formatting",
        () => { should(elements.input.props.value).eql("2019-11-01") });
      it("renders id when specified directly",
        () => { should(elements.input.props.id).eql(props.id) });
      it("renders onchange when specified directly", () => {
        td.verify(onchange.onchange(targetDate.toDate()));
      });
    });

    it("uses the object if specified", () => {
      // given
      const initialValue = moment("2019-12-01").toDate();
      const newValue = "2018-01-01";
      const fieldName = "fieldname";
      const props: DateInputProps = {
        object: { "fieldname": initialValue },
        field: fieldName
      };

      // when
      const component = DateInput(props);
      const rendered = component.render();
      const elements = getTextInputElements(rendered);
      elements.input.props.onkeyup({ target: { value: newValue } });

      // then
      should((props.object as any)[fieldName]).eql(moment(newValue).toDate());
      should(elements.input.props.value).eql(dateUtils.format(initialValue))
    });
  });

  context("Button", () => {
    context("base rendering", () => {
      // given
      const onclick: any = td.object("onclick");
      const fakeEvent: any = td.object("stopPropagation");
      const clss = "right";
      const props: ButtonProps = {
        icon: "iconname",
        class: clss,
        onclick: onclick.onclick as () => void,
        text: "the text"
      };

      // when
      const component = Button(props);
      const rendered = component.render();

      // then
      const button = rendered;
      const icon = findChildByType(button, "i");
      const textElements = findChildrenByType(button, "TEXT");
      it("rendered icon", () => {
        should(icon).not.be.null();
        should(icon.props.class).eql("fa fa-iconname");
      });
      it("rendered class for primary", () => should(button.props.class).containEql("btn-primary"));
      it("rendered additional class", () => should(button.props.class).containEql(clss));
      it("rendered text", () => should(textElements).matchAny(text => should(text.props.text).containEql("the text")));
      button.props.onclick(fakeEvent);
      it("stops propagation of event onclick", () => { td.verify(fakeEvent.stopPropagation()); });
      it("rendered onclick", () => { td.verify(onclick.onclick()); });
    });

    context("ignores icon", () => {
      // given
      const props: ButtonProps = {
        onclick: () => { },
        type: "secondary",
        text: "the text"
      };

      // when
      const component = Button(props);
      const rendered = component.render();

      // then
      const button = rendered;
      const icon = findChildByType(button, "i");
      const textElements = findChildrenByType(button, "TEXT");
      it("didnt render an icon", () => { should(icon).be.undefined(); });
      it("rendered class for secondary", () => should(button.props.class).containEql("btn-secondary"));
      it("rendered text", () => should(textElements).matchAny(text => should(text.props.text).containEql("the text")));
    })
  });

  context("Text display", () => {
    // given
    const props: TextDisplayProps = {
      caption: "The caption",
      class: "myclass",
      field: "thefield",
      object: { thefield: "the value" }
    };

    // when
    const component = TextDisplay(props);
    const rendered = component.render();

    // then
    const div = rendered;
    const em = findChildByType(div, "em");
    const emText = findChildByType(em, "TEXT");
    const p = findChildByType(div, "p");
    const pText = findChildByType(p, "TEXT");
    it("rendered caption", () => should(emText.props.text).containEql("The caption"));
    it("rendered value", () => should(pText.props.text).containEql("the value"));
    it("rendered class", () => should(div.props.class).containEql("myclass"));

  });

  context("Markdown input", () => {
    context("renders base parameters", () => {
      // given
      const onchange: any = td.object("onchange");
      const props: MarkdownInputProps = {
        class: "thisisaclass",
        caption: "this is a caption",
        placeholder: "this is a placeholder",
        value: "this is the default value",
        id: "default-id",
        onchange: onchange.onchange
      };

      // when
      const component = MarkdownInput(props);
      const rendered = component.render();
      const div = rendered;
      const caption = findChildByType(div, "p");
      const captionText = findChildByType(caption, "TEXT");
      const textArea = findChildByType(div, "textarea");
      const textAreaText = findChildByType(textArea, "TEXT");

      // then
      should(div.type).equal("div");
      it("renders class",
        () => should(div.props.class).containEql(props.class));
      it("displays caption",
        () => should(captionText.props.text).eql(props.caption));
      it("renders placeholder",
        () => { should(textArea.props.placeholder).eql(props.placeholder) });
      it("renders value when specified directly",
        () => { should(textAreaText.props.text).eql(props.value) });
      it("renders id when specified directly",
        () => { should(textArea.props.id).eql(props.id) });
      it("renders onchange when specified directly", () => {
        textArea.props.onkeyup({ target: { value: "value" } });
        td.verify(onchange.onchange("value"));
      });
    })
  });
});