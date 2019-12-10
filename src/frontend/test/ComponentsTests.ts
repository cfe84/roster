import { TextInput, DateInput } from "../src/baseComponents";
import should from "should";
import { TextInputProps } from "../src/baseComponents/TextInputComponent";
import { UIElement } from "../src/html";
import * as td from "testdouble";
import { DateInputProps } from "../src/baseComponents/DateInputComponent";
import moment from "moment";
import { dateUtils } from "../src/utils/dateUtils";

const findChildByType = (element: UIElement, type: string) =>
  element.props.children.find((child: UIElement) => child.type === type)

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
    })
  })
});