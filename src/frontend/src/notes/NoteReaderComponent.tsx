import { UIElement, Component } from "../html/index";
import { Note } from "./Note";
import { dateUtils } from "../utils/dateUtils";
// import MarkdownIt from "markdown-it";
import marked from "marked";
import { GUID } from "../utils/guid";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";

interface NoteReaderProps {
  note: Note,
  onEdit: ((note: Note) => void),
  onBack: (() => void)
}

export class NoteReaderComponent extends Component {

  constructor(public props: NoteReaderProps) { super() }

  public render = (): UIElement => {
    const note = this.props.note;
    const markdownDisplay = <MarkdownDisplay
      value={note.content}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <h2 class="text-center"><i class="fa fa-sticky-note"></i> {this.props.note.title}</h2>
      <p class="text-center"><small class="mb-1 ml-auto color-medium">{dateUtils.format(note.date)}</small></p>
      {markdownDisplay.render()}
      <button class="btn btn-primary" onclick={() => this.props.onEdit(this.props.note)}><i class="fa fa-pen"></i> Edit</button>
      &nbsp;<button class="btn btn-secondary" onclick={this.props.onBack}><i class="fa fa-arrow-left"></i> Back</button>
    </div>;
  }

}

export const NoteReader = (props: NoteReaderProps) => new NoteReaderComponent(props);
