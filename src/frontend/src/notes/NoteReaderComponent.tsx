import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dateUtils } from "../utils/dateUtils";
// import MarkdownIt from "markdown-it";
import marked from "marked";
import { GUID } from "../utils/guid";

interface NoteReaderProps {
  note: Note,
  onEdit: ((note: Note) => void),
  onBack: (() => void)
}

export class NoteReaderComponent extends Component {

  constructor(public props: NoteReaderProps) { super() }

  public render = (): UIElement => {
    const note = this.props.note;
    const parsedNote = marked(note.content);
    const noteId = `content-${GUID.newGuid()}`;
    const script = `document.getElementById("${noteId}").innerHTML = "${parsedNote.replace(/"/gm, '\\"').replace(/\n/gm, "\\\n")}";`

    return <div>
      <h2 class="text-center"><i class="fa fa-sticky-note"></i> {this.props.note.title}</h2>
      <p class="mb-1">{dateUtils.format(note.date)}</p>
      <p class="mb-1" id={noteId}>Loading. You shouldn't see this, this is a very bad sign.</p>
      <button class="btn btn-primary" onclick={() => this.props.onEdit(this.props.note)}><i class="fa fa-pen"></i> Edit</button>
      &nbsp;<button class="btn btn-secondary" onclick={this.props.onBack}><i class="fa fa-arrow-left"></i> Back</button>
      <script>
        {script}
      </script>
    </div>;
  }

}

export const NoteReader = (props: NoteReaderProps) => new NoteReaderComponent(props);
