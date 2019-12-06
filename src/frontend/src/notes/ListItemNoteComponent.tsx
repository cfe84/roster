import { UIElement, Component } from "../html/index";
import { Note } from ".";

interface ListItemNoteProps {
  note: Note,
  onNoteClicked: (() => void)
  onEditClicked: (() => void),
}

class ListItemNoteComponent extends Component {
  constructor(private props: ListItemNoteProps) { super(); }

  public render = (): UIElement =>
    <li
      class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
      onclick={this.props.onNoteClicked}>
      <div class="">{this.props.note.title}</div>
      <div class="ml-auto">
        <button
          class="btn btn-primary align-right"
          onclick={(event: MouseEvent) => { this.props.onEditClicked(); event.stopPropagation() }}>
          Edit
      </button>
      </div>
    </li>
}

export const ListItemNote = (props: ListItemNoteProps) => new ListItemNoteComponent(props);