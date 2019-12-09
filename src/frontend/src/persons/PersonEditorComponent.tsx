import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { TextInput, DateInput } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

interface PersonEditorProps {
  actionName?: string,
  person: Person,
  onValidate: ((person: Person) => void),
  onCancel: (() => void)
}

export class PersonEditorComponent extends Component {

  constructor(private props: PersonEditorProps) { super() }

  public render = (): UIElement => {

    const person = objectUtils.clone(this.props.person);

    return <div>
      <h2 class="text-center">{this.props.actionName || "Add a person"} {this.props.person.name}</h2>
      <form class="form-create-element">
        <TextInput caption="Name" object={person} field="name"></TextInput>
        <DateInput caption="In company since" value={person.inCompanySince} onchange={(value) => person.inCompanySince = value}></DateInput>
        <div class="row">
          <TextInput class="col-4" caption="Position / rank" object={person} field="position"></TextInput>
          <DateInput class="col" caption="In position since" value={person.inPositionSince} onchange={(value) => person.inPositionSince = value}></DateInput>
        </div>
        <div class="row">
          <TextInput class="col-4" caption="Role in team" object={person} field="role"></TextInput>
          <DateInput class="col" caption="In team since" value={person.inTeamSince} onchange={(value) => person.inTeamSince = value}></DateInput>
        </div>

        <button class="btn btn-primary" onclick={(() => this.props.onValidate(person))}><i class="fa fa-save"></i> {this.props.actionName || "Create"} person</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}><i class="fa fa-times"></i> Cancel</button>
      </form>
    </div >;
  }
}

export const PersonEditor = (props: PersonEditorProps) => new PersonEditorComponent(props);