import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dateUtils } from "../utils/dateUtils";
import { MarkdownInput, TextInput, DateInput, Button, DateDisplay, PageTitle } from "../baseComponents";
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
    const note: Note = objectUtils.clone(this.props.note);
    const saveButtonCaption = `${this.props.actionName || "Create"} note`
    const title = `${this.props.actionName || "New note"} ${note.title}`;
    return <div>
      <PageTitle title={title} icon="sticky-note" onBack={this.props.onCancel} />
      <div class="form-create-element">
        <TextInput caption="Title" object={note} field="title" />
        <MarkdownInput caption="Content" object={note} field="content" />
        <DateDisplay caption="Created date" object={note} field="createdDate" />
        <Button class="mr-2" onclick={() => { note.lastEditDate = new Date(); this.props.onValidate(note) }} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </div>
    </div>;
  }

}

export const NoteEditor = (props: NoteEditorProps) => new NoteEditorComponent(props);
