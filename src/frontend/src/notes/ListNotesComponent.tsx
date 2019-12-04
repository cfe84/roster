import { UIElement } from "../html/index";
import { Note } from ".";
import { ListItemNoteComponent } from "./ListItemNoteComponent";

interface ListNotesProps {
  notes: Note[],
  onNoteClicked: ((n: Note) => void),
  onAddNoteClicked: (() => void),
  onEditNoteClicked: ((n: Note) => void)
}

export const ListNotesComponent = (props: ListNotesProps): UIElement => {
  const rows = props.notes
    .map(note =>
      <ListItemNoteComponent note={note}
        onNoteClicked={() => props.onNoteClicked(note)}
        onEditClicked={() => props.onEditNoteClicked(note)}
      ></ListItemNoteComponent>);

  return <div class="d-flex flex-column w-50 mx-auto">
    <h2 class="text-center">Notes</h2>
    <ul class="list-group flex-column" id="elements">
      {rows}
    </ul>
    <br />
    <button class="btn btn-primary"
      onclick={props.onAddNoteClicked}>Add note</button>
  </div>;
}
