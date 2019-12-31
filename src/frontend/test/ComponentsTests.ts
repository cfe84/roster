import { TextInput, DateInput, CaptionComponent, ListItemComponent } from "../src/baseComponents";
import should from "should";
import { TextInputProps } from "../src/baseComponents/TextInputComponent";
import { UIElement } from "../src/html";
import * as td from "testdouble";
import { DateInputProps } from "../src/baseComponents/DateInputComponent";
import moment from "moment";
import { dateUtils } from "../src/utils/dateUtils";
import { ButtonProps, Button, ButtonComponent } from "../src/baseComponents/ButtonComponent";
import { TextDisplayComponent, TextDisplayProps, TextDisplay } from "../src/baseComponents/TextDisplayComponent";
import { MarkdownInputProps, MarkdownInput } from "../src/baseComponents/MarkdownInputComponent";
import { ListComponent, ListProps } from "../src/baseComponents/ListComponent";
import { ILocalStorage } from "../src/storage/ILocalStorage";

const findChildByType = (element: UIElement, type: any) =>
  element.props.children.find((child: UIElement) => child.type === type)
const findChildrenByType = (element: UIElement, type: string) =>
  element.props.children.filter((child: UIElement) => child.type === type)

describe("Common components", () => {
  const getTextInputElements = (element: UIElement): any => {
    const div = element;
    const p = findChildByType(div, "p");
    const em = findChildByType(p, "em")
    const caption = findChildByType(em, "TEXT");
    const input = findChildByType(div, "input");
    return { div, p, em, caption, input }
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

    it("uses the object if specified", () => {
      // given
      const initialValue = "initial value";
      const newValue = "new value";
      const fieldName = "fieldname";
      const props: TextInputProps = {
        object: { "fieldname": initialValue },
        caption: "cap",
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

    it("sets default value to empty string if undefined", () => {
      // given
      const initialValue = undefined;
      const fieldName = "fieldname";
      const props: TextInputProps = {
        object: { "fieldname": initialValue },
        caption: "cap",
        field: fieldName
      };

      // when
      const component = TextInput(props);
      const rendered = component.render();
      const elements = getTextInputElements(rendered);

      // then
      should(elements.input.props.value).eql("")
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
        caption: "ca",
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
    const ps = findChildrenByType(div, "p");
    const em = findChildByType(ps[0], "em");
    const emText = findChildByType(em, "TEXT");
    const pText = findChildByType(ps[1], "TEXT");
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
      const caption = div.props.children[0];
      const textArea = findChildByType(div, "textarea");
      const textAreaText = findChildByType(textArea, "TEXT");

      // then
      should(div.type).equal("div");
      it("renders class",
        () => should(div.props.class).containEql(props.class));
      it("displays caption",
        () => should(caption.props.caption).eql(props.caption));
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
    });

    it("hides caption if it's not there", () => {
      // given
      const props: MarkdownInputProps = {};
      const component = MarkdownInput(props);

      // when
      const rendered = component.render();
      const div = rendered;
      const caption = findChildByType(div, "p");
      const textArea = findChildByType(div, "textarea");

      // then
      should(div.type).equal("div");
      should(caption).be.undefined();
      should(textArea).not.be.undefined();
    })
  });

  context("List", () => {
    class FakeClass { }
    context("Base rendering", () => {
      // given
      const fake = td.object(["display", "addClicked", "clicked", "editClicked"]);
      const elements = [new FakeClass(), new FakeClass()]
      const fakeEvent = td.object(["stopPropagation"])
      const title = "title-1";
      const props: ListProps<FakeClass> = {
        elementDisplay: (element) => fake.display(element),
        elements,
        title,
        onAddClicked: () => fake.addClicked(),
        onClicked: (element) => fake.clicked(element),
        onEditClicked: (element) => fake.editClicked(element)
      }

      // when
      const list = new ListComponent(props);
      const rendered = list.render();
      const div = rendered;
      const ul = findChildByType(div, "ul");
      const button: ButtonComponent = div.props.children.find((child: object) => child instanceof ButtonComponent)
      const rows: ListItemComponent<FakeClass>[] = ul.props.children[0];
      const renderedRows = rows.map(row => row.render())
      const titleComponent = findChildByType(div, "h3");

      button.props.onclick();
      renderedRows.forEach((element: UIElement) => element.props.onclick());
      renderedRows.forEach((element: UIElement) => findChildByType(findChildByType(element, "div"), "button").props.onclick(fakeEvent));


      // then
      it("should render children using elementDisplay", () => elements.forEach((element) => td.verify(fake.display(element))));
      it("should handle addClicked", () => td.verify(fake.addClicked()));
      it("should handle element clicked", () => elements.forEach(element => td.verify(fake.clicked(element))))
      it("should handle element edit clicked", () => elements.forEach(element => td.verify(fake.editClicked(element))))
      it("should render title when specified", () => {
        should(titleComponent).not.be.undefined();
        should(findChildrenByType(titleComponent, "TEXT")).matchAny(child => child.props.text === title)
      });
    });
    it("hides title when not specified", () => {
      // given
      const elements = [new FakeClass];
      const fake = td.object(["display"]);

      // when
      const list = new ListComponent({
        elementDisplay: fake.display,
        elements
      })
      const rendered = list.render();
      const div = rendered;
      const titleComponent = findChildByType(div, "h3");

      // then
      should(titleComponent).be.undefined();
    });
  })
});