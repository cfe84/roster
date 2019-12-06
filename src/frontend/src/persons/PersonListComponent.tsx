import { UIElement } from "../html/index";
import { PersonListItemComponent } from "./PersonListItemComponent";
import { Person } from "./Person";

interface ListPeopleProps {
  people: Person[],
  onPersonClicked: ((p: Person) => void),
  onAddPersonClicked: (() => void),
  onEditPersonClicked: ((p: Person) => void)
}

export const PersonListComponent = (props: ListPeopleProps): UIElement => {
  const rows = props.people
    .map(person =>
      <PersonListItemComponent person={person}
        onPersonClicked={() => props.onPersonClicked(person)}
        onEditClicked={() => props.onEditPersonClicked(person)}
      ></PersonListItemComponent>);

  return <div class="d-flex flex-column w-50 mx-auto">
    <h2 class="text-center">People</h2>
    <ul class="list-group flex-column" id="elements">
      {rows}
    </ul>
    <br />
    <button class="btn btn-primary"
      onclick={props.onAddPersonClicked}>Add person</button>
  </div>;
}
