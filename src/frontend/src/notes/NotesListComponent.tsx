import { UIElement } from "../html/index";
import { Note } from ".";
import { NotesListItem } from "./NotesListItemComponent";
import { Component } from "../html/Component";

interface NotesListProps {
  notes: Note[],
  onNoteClicked: ((n: Note) => void),
  onAddNoteClicked: (() => void),
  onEditNoteClicked: ((n: Note) => void)
}

export class NotesListComponent extends Component {
  constructor(private props: NotesListProps) { super() }
  public render = (): UIElement => {
    const rows = this.props.notes
      .map(note =>
        <NotesListItem note={note}
          onNoteClicked={() => this.props.onNoteClicked(note)}
          onEditClicked={() => this.props.onEditNoteClicked(note)}
        ></NotesListItem>);

    return <div>
      <h3 class="text-center"><i class="fa fa-sticky-note" /> Notes</h3>
      <ul class="list-group flex-column" id="elements">
        {rows}
      </ul>
      <br />
      <button class="btn btn-primary"
        onclick={this.props.onAddNoteClicked}><i class="fa fa-plus"></i> Add</button>
    </div>;
  }
}

export const NotesList = (props: NotesListProps) => new NotesListComponent(props);

