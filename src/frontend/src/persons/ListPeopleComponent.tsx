import { UIElement } from "../html/index";
import { ListItemPersonComponent } from "./ListItemPersonComponent";
import { Person } from "./Person";

interface ListPeopleProps {
  people: Person[],
  onAddPersonClicked: (() => void)
}

export const ListPeopleComponent = (props: ListPeopleProps): UIElement => {
  const rows = props.people.map(person => <ListItemPersonComponent name={person.name}></ListItemPersonComponent>);

  return <div class="d-flex flex-column w-50 mx-auto">
    <h2 class="text-center">People</h2>
    <ul class="list-group flex-column" id="elements">
      {rows}
    </ul>
    <br />
    <button class="btn btn-primary" id="tamere" onclick={props.onAddPersonClicked}>Add person</button>
  </div>;
}
