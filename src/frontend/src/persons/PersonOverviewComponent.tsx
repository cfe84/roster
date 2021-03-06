import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { NotesController } from "../notes";
import { dateUtils } from "../utils/dateUtils";
import { Button, TextDisplay, DateDisplay } from "../baseComponents";
import { DiscussionController } from "../discussions";
import { DeadlineController } from "../deadlines";
import { PageTitle } from "../baseComponents/PageTitleComponent";
import { ActionController } from "../actions";
import { PeriodController } from "../period";

interface PersonOverviewProps {
  person: Person,
  notesController: NotesController,
  discussionController: DiscussionController,
  deadlineController: DeadlineController,
  actionController: ActionController,
  periodController: PeriodController,
  onEditClicked: ((person: Person) => void)
  onExitClicked: (() => void)
}

export class PersonOverviewComponent extends Component {

  constructor(public props: PersonOverviewProps) { super() }

  public render = async (): Promise<UIElement> => {
    const person = this.props.person;
    const notesList = await this.props.notesController.getNotesListAsync(person.id);
    const discussionList = await this.props.discussionController.getDiscussionListAsync(person.id);
    const actionList = await this.props.actionController.getPersonListComponentAsync(person.id);
    const deadlinesList = await this.props.deadlineController.getDeadlineListAsync(person.id);
    const periodList = await this.props.periodController.getPersonListComponentAsync(person.id);

    return <div>
      <PageTitle title={person.name} icon="user" onBack={this.props.onExitClicked}></PageTitle>
      <div class="row">
        <div class="col-sm">
          <h3 class="text-center"><i class="fa fa-info-circle" /> Information</h3>
          <DateDisplay caption="In company since" value={person.inCompanySince} includeTimespan={true} />
          <div class="row">
            <TextDisplay class="col-4" caption="Position / rank" value={person.position}></TextDisplay>
            <DateDisplay class="col" caption="In position since" includeTimespan={true} value={person.inPositionSince} />
          </div>
          <div class="row">
            <TextDisplay class="col-4" caption="Role in team" value={person.role}></TextDisplay>
            <DateDisplay class="col" caption="Joined team" value={person.inTeamSince} includeTimespan={true} />
          </div>
          <div class="d-flex">
            <Button icon="pen" class="w-5 mr-2" type="primary" onclick={() => this.props.onEditClicked(person)} text="Edit"></Button>
          </div>
          <div class="mb-5">{periodList}</div>
          <div class="mb-5">{discussionList}</div>
        </div>
        <div class="col-sm">
          <div class="mb-5">{actionList}</div>
          <div class="mb-5">{deadlinesList}</div>
          <div class="mb-5">{notesList}</div>
        </div>
      </div>
      <br />
    </div>;
  }
}

export const PersonOverview = (props: PersonOverviewProps) => new PersonOverviewComponent(props);
