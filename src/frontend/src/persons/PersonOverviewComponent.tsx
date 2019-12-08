import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { NotesController } from "../notes";
import { dateUtils } from "../utils/dateUtils";

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
          <p class="mb-1">In company since {dateUtils.format(person.inCompanySince)}</p>
          <div class="row">
            <div class="col-4">
              <p class="mb-1">Position / rank: {person.position}</p>
            </div>
            <div class="col">
              <p class="mb-1">In position since {dateUtils.format(person.inPositionSince)}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <p class="mb-1">Role in team: {person.role}. Joined team on {dateUtils.format(person.inTeamSince)}</p>
            </div>
          </div>
        </div>
        <div class="col-sm">
          {notesList}
        </div>
      </div>
      <br />
      <button class="btn btn-primary w-5"
        onclick={this.props.onExitClicked}><i class="fa fa-arrow-left"></i> Back</button>
    </div>;
  }
}

export const PersonOverview = (props: PersonOverviewProps) => new PersonOverviewComponent(props);
