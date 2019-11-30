import { UIElement } from "../html/index";
import { Person } from "./Person";

interface EditPersonProps {
  actionName?: string,
  person: Person,
  onValidate: ((person: Person) => void),
  onCancel: (() => void)
}

export const EditPersonComponent = (props: EditPersonProps) => {

  const person = props.person;

  const updatePerson = (delegate: ((person: Person) => void)): (() => void) => {
    return () => {
      const nameInput = document.getElementById("input-name") as HTMLInputElement;
      if (nameInput) {
        person.name = nameInput.value || ""
        delegate(person);
      }
    }
  }

  return <div class="vertical-center">
    <form class="form-create-element">
      <p class="mb-1">Person's name</p>
      <input class="form-control mb-3" id="input-name" placeholder="Person name"
        type="text" value={person.name}></input>
      <button class="btn btn-primary" onclick={updatePerson(props.onValidate)}>{props.actionName || "Create"} person</button>
      &nbsp;<button class="btn btn-secondary" onclick={props.onCancel}>Cancel</button>
    </form>
  </div>;
}