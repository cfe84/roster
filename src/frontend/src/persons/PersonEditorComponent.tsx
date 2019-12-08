import { UIElement, Component } from "../html/index";
import { Person } from "./Person";
import { dom } from "../utils/dom";
import { dateUtils } from "../utils/dateUtils";

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
        const person: Person = {
          id: this.props.person.id,
          name: dom.getInputValue("input-name"),
          role: dom.getInputValue("input-role"),
          position: dom.getInputValue("input-position"),
          inPositionSince: new Date(Date.parse(dom.getInputValue("input-inpositionsince"))),
          inCompanySince: new Date(Date.parse(dom.getInputValue("input-incompanysince"))),
          inTeamSince: new Date(Date.parse(dom.getInputValue("input-inteamsince"))),
        }
        delegate(person);
      }
    }

    return <div>
      <h2 class="text-center">{this.props.actionName || "Add a person"} {this.props.person.name}</h2>
      <form class="form-create-element">
        <p class="mb-1">Person's name</p>
        <input class="form-control mb-3" id="input-name" placeholder="Person name" type="text" value={person.name}></input>
        <p class="mb-1">In company since</p>
        <input class="form-control mb-3" id="input-incompanysince" placeholder="In company since" type="text" value={dateUtils.format(person.inCompanySince)}></input>
        <div class="row">
          <div class="col-4">
            <p class="mb-1">Position / rank</p>
            <input class="form-control mb-3" id="input-position" placeholder="Position" type="text" value={person.position}></input>
          </div>
          <div class="col">
            <p class="mb-1">In position since</p>
            <input class="form-control mb-3" id="input-inpositionsince" placeholder="In position since" type="text" value={dateUtils.format(person.inPositionSince)}></input>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <p class="mb-1">Role in team</p>
            <input class="form-control mb-3" id="input-role" placeholder="Role in the team" type="text" value={person.role}></input>
          </div>
          <div class="col">
            <p class="mb-1">In team since</p>
            <input class="form-control mb-3" id="input-inteamsince" placeholder="In the team since" type="text" value={dateUtils.format(person.inTeamSince)}></input>
          </div>
        </div>

        <button class="btn btn-primary" onclick={updatePerson(this.props.onValidate)}><i class="fa fa-save"></i> {this.props.actionName || "Create"} person</button>
        &nbsp;<button class="btn btn-secondary" onclick={this.props.onCancel}><i class="fa fa-times"></i> Cancel</button>
      </form>
    </div>;
  }
}

export const PersonEditor = (props: PersonEditorProps) => new PersonEditorComponent(props);