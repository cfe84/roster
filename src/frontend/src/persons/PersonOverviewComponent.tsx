import { UIElement, Component } from "../html/index";
import { Person } from "./Person";

interface PersonOverviewProps {
  person: Person,
  onEditPersonClicked: ((p: Person) => void),
  onExitClicked: (() => void),
  onNewNoteClicked: (() => void)
}

class PersonOverviewComponent extends Component {

  constructor(private props: PersonOverviewProps) { super() }

  public render = (): UIElement => {
    const person = this.props.person;

    return <div class="d-flex flex-column w-50 mx-auto">
      <h2 class="text-center">{person.name}</h2>

      <br />

      <h3>Notes</h3>
      <button class="btn btn-primary"
        onclick={this.props.onNewNoteClicked}>New note</button>
      <button class="btn btn-primary"
        onclick={this.props.onExitClicked}>Back</button>
    </div>;
  }
}

export const PersonOverview = (props: PersonOverviewProps) => new PersonOverviewComponent(props);
