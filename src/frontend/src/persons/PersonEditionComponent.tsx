import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { dom } from "../utils/dom";

interface PersonEditorProps {
  actionName?: string,
  person: Person,
  onValidate: ((person: Person) => void),
  onCancel: (() => void)
}

export class PersonEditorComponent extends Component {

  constructor(private props: PersonEditorProps) { super() }
  public render = (): UIElement => {

    const person = this.props.person;

    const updatePerson = (delegate: ((person: Person) => void)): (() => void) => {
      return () => {
        person.name = dom.getInputValue("input-name");
        delegate(person);
      }
    }

    return <div>
      <h2 class="text-center">{this.props.actionName || "Add a person"} {this.props.person.name}</h2>
      <form class="form-create-element">
        <p class="mb-1">Person's name</p>
        <input class="form-control mb-3" id="input-name" placeholder="Person name"
          type="text" value={person.name}></input>
        <button class="btn btn-primary" onclick={updatePerson(this.props.onValidate)}>{this.props.actionName || "Create"} person</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}>Cancel</button>
      </form>
    </div>;
  }
}

export const PersonEditor = (props: PersonEditorProps) => new PersonEditorComponent(props);