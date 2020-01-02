import { UIElement, Component } from "../html/index";
import { PersonListItemComponent } from "./PersonListItemComponent";
import { Person } from "./Person";
import { Button } from "../baseComponents";

interface ListPeopleProps {
  people: Person[],
  onPersonClicked: ((p: Person) => void),
  onAddPersonClicked: (() => void),
  onEditPersonClicked: ((p: Person) => void)
}

export class PersonListComponent extends Component {
  constructor(public props: ListPeopleProps) {
    super();
  }

  public addPerson(person: Person) {
    if (this.list) {
      console.log("Adding person")
      person.name = "dsfsdf" + person.name;
      const personItem = this.mapPersonToListItem(person);
      this.list.props.children.push(personItem);
    }
  }

  private list?: UIElement;

  private mapPersonToListItem = (person: Person) => <PersonListItemComponent person={person}
    onPersonClicked={() => this.props.onPersonClicked(person)}
    onEditClicked={() => this.props.onEditPersonClicked(person)}
  ></PersonListItemComponent>;

  public render = (): UIElement => {
    const generateRows = () => {
      return this.props.people
        .map(this.mapPersonToListItem);
    }

    this.list = <ul class="list-group flex-column mb-2">
      {generateRows()}
    </ul>;

    return <div>
      <h2 class="text-center"><i class="fa fa-user" /> People</h2>
      {this.list}
      <Button icon="plus" onclick={this.props.onAddPersonClicked} text="Add person"></Button>
    </div>;
  }
}

export const PersonList = (props: ListPeopleProps) => new PersonListComponent(props)

