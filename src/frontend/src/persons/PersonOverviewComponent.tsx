import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { NotesController } from "../notes";

interface PersonOverviewProps {
  person: Person,
  notesController: NotesController
  onExitClicked: (() => void)
}

export class PersonOverviewComponent extends Component {

  constructor(public props: PersonOverviewProps) { super() }

  public render = async (): Promise<UIElement> => {
    const person = this.props.person;
    const notesList = await this.props.notesController.getNotesListAsync(this.props.person.id);
    return <div>
      <h3 class="text-center"><i class="fa fa-user"></i> {person.name}</h3>
      <div class="row">
        <div class="col-sm">
          <h3>Details</h3>
        </div>
        <div class="col-sm">
          {notesList}
        </div>
      </div>
      <br />
      <button class="btn btn-primary w-5"
        onclick={this.props.onExitClicked}>Back</button>
    </div>;
  }
}

export const PersonOverview = (props: PersonOverviewProps) => new PersonOverviewComponent(props);
