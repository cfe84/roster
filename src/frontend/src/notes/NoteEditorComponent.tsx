import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dom } from "../utils/dom";
import { dateUtils } from "../utils/dateUtils";
import { MarkdownInput } from "../baseComponents";
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

    return <div>
      <form class="form-create-element">
        <div>
          <h2 class="text-center">{this.props.actionName || "New note"} {this.props.note.title}</h2>
          <p class="mb-1">Title</p>
          <input class="form-control mb-3" id="input-title" placeholder="Title" type="text" value={note.title}></input>
        </div>
        <MarkdownInput
          caption="Content"
          object={note}
          field="content"
        ></MarkdownInput>
        <p class="mb-1">Date</p>
        <input class="form-control mb-3" id="input-date" placeholder="Date" type="text" value={dateUtils.format(note.date)}></input>
        <button class="btn btn-primary" onclick={() => { this.props.onValidate(note) }}><i class="fa fa-save"></i> {this.props.actionName || "Create"} note</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}><i class="fa fa-times"></i> Cancel</button>
      </form>
    </div>;
  }

}

export const NoteEditor = (props: NoteEditorProps) => new NoteEditorComponent(props);
