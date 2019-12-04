import { UIElement } from "../html/index";
import { Note } from ".";

interface ListItemNoteProps {
  note: Note,
  onNoteClicked: (() => void)
  onEditClicked: (() => void),
}

export const ListItemNoteComponent = (props: ListItemNoteProps): UIElement =>
  <li
    class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
    onclick={props.onNoteClicked}>
    <div class="">{props.note.title}</div>
    <div class="ml-auto">
      <button
        class="btn btn-primary align-right"
        onclick={(event: MouseEvent) => { props.onEditClicked(); event.stopPropagation() }}>
        Edit
      </button>
    </div>
  </li>