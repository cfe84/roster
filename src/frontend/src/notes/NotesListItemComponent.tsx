import { UIElement, Component } from "../html/index";
import { Note } from ".";
import { dateUtils } from "../utils/dateUtils";

interface NotesListItemProps {
  note: Note,
  onNoteClicked: ((note: Note) => void)
  onEditClicked: ((note: Note) => void),
}

class NotesListItemComponent extends Component {
  constructor(private props: NotesListItemProps) { super(); }

  public render = (): UIElement =>
    <li class="w-100 d-flex align-items-center list-group-item list-group-item-action btn"
      onclick={() => this.props.onNoteClicked(this.props.note)}>
      <div class="">{this.props.note.title}
      </div>
      <div class="ml-auto">
        <small class="mr-2 color-medium" >({dateUtils.format(this.props.note.date)})</small>
        <button
          class="btn btn-primary align-right"
          onclick={(event: MouseEvent) => { this.props.onEditClicked(this.props.note); event.stopPropagation() }}>
          <i class="fa fa-pen"></i> Edit
      </button>
      </div>
    </li>
}

export const NotesListItem = (props: NotesListItemProps) => new NotesListItemComponent(props);