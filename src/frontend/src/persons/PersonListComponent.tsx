import { UIElement, Component } from "../html/index";
import { PersonListItemComponent } from "./PersonListItemComponent";
import { Person } from "./Person";

interface ListPeopleProps {
  people: Person[],
  onPersonClicked: ((p: Person) => void),
  onAddPersonClicked: (() => void),
  onEditPersonClicked: ((p: Person) => void)
}

export class PersonListComponent extends Component {
  constructor(public props: ListPeopleProps) { super() }

  public render = (): UIElement => {
    const generateRows = () => {
      return this.props.people
        .map(person =>
          <PersonListItemComponent person={person}
            onPersonClicked={() => this.props.onPersonClicked(person)}
            onEditClicked={() => this.props.onEditPersonClicked(person)}
          ></PersonListItemComponent>);
    }

    return <div class="d-flex flex-column ml-2 mr-2">
      <h2 class="text-center">People</h2>
      <ul class="list-group flex-column" id="elements">
        {generateRows()}
      </ul>
      <br />
      <button class="btn btn-primary"
        onclick={this.props.onAddPersonClicked}>Add person</button>
    </div>;
  }
}

export const PersonList = (props: ListPeopleProps) => new PersonListComponent(props)

