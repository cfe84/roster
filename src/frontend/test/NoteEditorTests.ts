import { UIElement, Component } from "../src/html";
import { NoteEditorComponent, Note, NoteEditorComponentProps } from "../src/notes";
import { objectUtils } from "../src/utils/objectUtils";
import { findChildrenByType, findChildrenByTypeDeep } from "./ComponentsTestsUtils";
import { ButtonComponent, MarkdownInputComponent } from "../src/baseComponents";
import should from "should";

describe.skip("Note editor tests", () => {
  context("when updating", () => {
    // given
    const originalNote: Note = {
      content: "abcd",
      typeId: "",
      personId: "1234",
      createdDate: new Date,
      lastEditDate: new Date,
      id: "abcd",
      title: "abcd"
    }
    let updatedNote: Note;
    const onValidate = (n: Note) => updatedNote = n;
    const note = objectUtils.clone(originalNote);
    const componentProps: NoteEditorComponentProps = {
      note,
      onCancel: () => { },
      onValidate,
      actionName: "Update"
    };
    const noteEditor = new NoteEditorComponent(componentProps);

    // when
    const element = noteEditor.render();
    const saveButton = element.props.children.filter((component: any) => component.props.icon === "save") as ButtonComponent;
    const editor = element.props.children.filter((component: any) => component.props.draftKey === "markdown.draft-abcd") as MarkdownInputComponent
    // saveButton.props.onclick();

    // then
    it("should not have a draft", () => {
      should(editor.draftExists()).be.false();
    })
  })
})