import { UIElement } from "../html/index";
import { Note } from ".";
import { ListItemNote } from "./ListItemNoteComponent";
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
        <ListItemNote note={note}
          onNoteClicked={() => this.props.onNoteClicked(note)}
          onEditClicked={() => this.props.onEditNoteClicked(note)}
        ></ListItemNote>);

    return <div class="d-flex flex-column w-50 mx-auto">
      <h3 class="text-center"><i class="fa fa-sticky-note" /> Notes</h3>
      <ul class="list-group flex-column" id="elements">
        {rows}
      </ul>
      <br />
      <button class="btn btn-primary"
        onclick={this.props.onAddNoteClicked}>Add note</button>
    </div>;
  }
}

export const NotesList = (props: NotesListProps) => new NotesListComponent(props);

