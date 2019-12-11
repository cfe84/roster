import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dom } from "../utils/dom";
import { dateUtils } from "../utils/dateUtils";
import { MarkdownInput, TextInput, DateInput, Button } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

interface NoteEditorProps {
  actionName?: string,
  note: Note,
  onValidate: ((note: Note) => void),
  onCancel: (() => void)
}

export class NoteEditorComponent extends Component {

  constructor(private props: NoteEditorProps) { super() }

  public render = (): UIElement => {
    const note = objectUtils.clone(this.props.note);
    const saveButtonCaption = `${this.props.actionName || "Create"} note`
    return <div>
      <form class="form-create-element">
        <h2 class="text-center">{this.props.actionName || "New note"} {note.title}</h2>
        <TextInput caption="Title" object={note} field="title" />
        <MarkdownInput caption="Content" object={note} field="content" />
        <DateInput caption="Date" object={note} field="date" />
        <Button class="mr-2" onclick={() => { this.props.onValidate(note) }} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </form>
    </div>;
  }

}

export const NoteEditor = (props: NoteEditorProps) => new NoteEditorComponent(props);
