import { UIElement } from "../html/index";
import { Note } from ".";
import { ListItemNote } from "./ListItemNoteComponent";
import { Component } from "../html/Component";

interface ListNotesProps {
  notes: Note[],
  onNoteClicked: ((n: Note) => void),
  onAddNoteClicked: (() => void),
  onEditNoteClicked: ((n: Note) => void)
}

class ListNotesComponent extends Component {
  constructor(private props: ListNotesProps) { super() }
  public render = (): UIElement => {
    const rows = this.props.notes
      .map(note =>
        <ListItemNote note={note}
          onNoteClicked={() => this.props.onNoteClicked(note)}
          onEditClicked={() => this.props.onEditNoteClicked(note)}
        ></ListItemNote>);

    return <div class="d-flex flex-column w-50 mx-auto">
      <h2 class="text-center">Notes</h2>
      <ul class="list-group flex-column" id="elements">
        {rows}
      </ul>
      <br />
      <button class="btn btn-primary"
        onclick={this.props.onAddNoteClicked}>Add note</button>
    </div>;
  }
}

export const ListNotes = (props: ListNotesProps) => new ListNotesComponent(props);

