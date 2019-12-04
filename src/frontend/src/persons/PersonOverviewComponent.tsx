import { UIElement } from "../html/index";
import { Person } from "./Person";

interface PersonOverviewProps {
  person: Person,
  onEditPersonClicked: ((p: Person) => void),
  onExitClicked: (() => void),
  onNewNoteClicked: (() => void)
}

export const PersonOverviewComponent = (props: PersonOverviewProps): UIElement => {
  const person = props.person;

  return <div class="d-flex flex-column w-50 mx-auto">
    <h2 class="text-center">{person.name}</h2>

    <br />

    <h3>Notes</h3>
    <button class="btn btn-primary"
      onclick={props.onNewNoteClicked}>New note</button>
    <button class="btn btn-primary"
      onclick={props.onExitClicked}>Back</button>
  </div>;
}