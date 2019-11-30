import { UIElement } from "../html/index";
import { ListItemPersonComponent } from "./ListItemPersonComponent";
import { Person } from "./Person";

interface ListPeopleProps {
  people: Person[],
  onAddPersonClicked: (() => void),
  onEditPersonClicked: ((p: Person) => void)
  onDeletePersonClicked: ((p: Person) => void)
}

export const ListPeopleComponent = (props: ListPeopleProps): UIElement => {
  const rows = props.people
    .map(person =>
      <ListItemPersonComponent name={person.name}
        onEditClicked={() => props.onEditPersonClicked(person)}
        onDeleteClicked={() => props.onDeletePersonClicked(person)}
      ></ListItemPersonComponent>);

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
