import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { TextInput, DateInput, Button } from "../baseComponents";
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
    const saveBtn = (this.props.actionName || "Create") + " person";
    return <div>
      <h2 class="text-center">{this.props.actionName || "Add a person"} {this.props.person.name}</h2>
      <form class="form-create-element">
        <TextInput caption="Name" object={person} field="name"></TextInput>
        <DateInput caption="In company since" object={person} field="inCompanySince"></DateInput>
        <div class="row">
          <TextInput class="col-4" caption="Position / rank" object={person} field="position"></TextInput>
          <DateInput class="col" caption="In position since" object={person} field="inPositionSince"></DateInput>
        </div>
        <div class="row">
          <TextInput class="col-4" caption="Role in team" object={person} field="role"></TextInput>
          <DateInput class="col" caption="In team since" object={person} field="inTeamSince"></DateInput>
        </div>
        <Button icon="save" class="mr-2" onclick={(() => this.props.onValidate(person))} text={saveBtn}></Button>
        <Button icon="times" onclick={this.props.onCancel} type="secondary" text="Cancel"></Button>
      </form>
    </div >;
  }
}

export const PersonEditor = (props: PersonEditorProps) => new PersonEditorComponent(props);