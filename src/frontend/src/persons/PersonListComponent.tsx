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

    return <div>
      <h2 class="text-center"><i class="fa fa-user" /> People</h2>
      <ul class="list-group flex-column mb-2" id="elements">
        {generateRows()}
      </ul>
      <button class="btn btn-primary"
        onclick={this.props.onAddPersonClicked}><i class="fa fa-plus"></i> Add person</button>
    </div>;
  }
}

export const PersonList = (props: ListPeopleProps) => new PersonListComponent(props)

