import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { NotesController } from "../notes";
import { dateUtils } from "../utils/dateUtils";
import { Button, TextDisplay } from "../baseComponents";

interface PersonOverviewProps {
  person: Person,
  notesController: NotesController
  onEditClicked: (() => void)
  onExitClicked: (() => void)
}

export class PersonOverviewComponent extends Component {

  constructor(public props: PersonOverviewProps) { super() }

  public render = async (): Promise<UIElement> => {
    const person = this.props.person;
    const notesList = await this.props.notesController.getNotesListAsync(
      this.props.person.id);
    return <div>
      <h3 class="text-center"><i class="fa fa-user"></i> {person.name}</h3>
      <div class="row">
        <div class="col-sm">
          <h3>Details</h3>
          <TextDisplay caption="In company since" value={dateUtils.format(person.inCompanySince)}></TextDisplay>
          <div class="row">
            <TextDisplay class="col-4" caption="Position / rank" value={person.position}></TextDisplay>
            <TextDisplay class="col" caption="In position since" value={dateUtils.format(person.inPositionSince)}></TextDisplay>
          </div>
          <div class="row">
            <TextDisplay class="col-4" caption="Role in team" value={person.role}></TextDisplay>
            <TextDisplay class="col" caption="Joined team on " value={dateUtils.format(person.inTeamSince)}></TextDisplay>
          </div>

          <div class="d-flex">
            <Button icon="times" class="btn-danger" type="secondary" onclick={this.props.onExitClicked} text="Delete"></Button>
            <Button icon="pen" class="ml-auto w-5 mr-2" type="primary" onclick={this.props.onEditClicked} text="Edit"></Button>
            <Button icon="arrow-left" class="w-5" type="secondary" onclick={this.props.onExitClicked} text="Back"></Button>
          </div>
        </div>
        <div class="col-sm">
          {notesList}
        </div>
      </div>
      <br />
    </div>;
  }
}

export const PersonOverview = (props: PersonOverviewProps) => new PersonOverviewComponent(props);
