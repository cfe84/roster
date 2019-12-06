import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dom } from "../utils/dom";

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
        <input class="form-control mb-3" id="input-content" placeholder="Content" type="text" value={note.content}></input>
        <p class="mb-1">Date</p>
        <input class="form-control mb-3" id="input-content" placeholder="Content" type="text" value={note.date}></input>
        <button class="btn btn-primary" onclick={updateNote(this.props.onValidate)}>{this.props.actionName || "Create"} note</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}>Cancel</button>
      </form>
    </div>;
  }

}

export const NoteEditor = (props: NoteEditorProps) => new NoteEditorComponent(props);
