import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dom } from "../utils/dom";
import { dateUtils } from "../utils/dateUtils";

interface NoteEditorProps {
  actionName?: string,
  note: Note,
  onValidate: ((note: Note) => void),
  onCancel: (() => void)
}

export class NoteEditorComponent extends Component {

  constructor(private props: NoteEditorProps) { super() }

  public render = (): UIElement => {


    const note = this.props.note;

    const updateNote = (delegate: ((note: Note) => void)): (() => void) => {
      return () => {
        const updatedNote: Note = {
          id: note.id,
          typeId: note.typeId,
          lastEditDate: new Date(Date.now()),
          personId: note.personId,
          content: dom.getInputValue("input-content"),
          date: new Date(Date.parse(dom.getInputValue("input-date"))),
          title: dom.getInputValue("input-title")
        };
        delegate(updatedNote);
      }
    }

    return <div>
      <h2 class="text-center">{this.props.actionName || "New note"} {this.props.note.title}</h2>
      <form class="form-create-element">
        <p class="mb-1">Title</p>
        <input class="form-control mb-3" id="input-title" placeholder="Title" type="text" value={note.title}></input>
        <p class="mb-1">Content</p>
        <textarea class="form-control mb-3" style="height: 300px" id="input-content" placeholder="Content" >{note.content}</textarea>
        <p class="mb-1">Date</p>
        <input class="form-control mb-3" id="input-date" placeholder="Date" type="text" value={dateUtils.format(note.date)}></input>
        <button class="btn btn-primary" onclick={updateNote(this.props.onValidate)}><i class="fa fa-save"></i> {this.props.actionName || "Create"} note</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}><i class="fa fa-times"></i> Cancel</button>
      </form>
    </div>;
  }

}

export const NoteEditor = (props: NoteEditorProps) => new NoteEditorComponent(props);
