import { EditPersonComponent, ListPeopleComponent, IPersonStore } from "./index";
import { UI } from "../html/UI";
import { UIElement } from "../html";
import { EventBus } from "../events";
import { PersonCreatedEvent } from "./PersonCreatedEvent";
import { Person } from "./Person";
import { PersonUpdatedEvent } from "./PersonUpdatedEvent";
import { GUID } from "../utils/guid"

export class PeopleController {
  people = [{ name: "Paul", id: "1" },
  { name: "Pierre", id: "2" },
  { name: "Peter", id: "3" }
  ];

  constructor(private eventBus: EventBus, private peopleStore: IPersonStore) {
  }

  public loadPeopleListAsync = async (): Promise<void> => {
    this.people = await this.peopleStore.getPeopleAsync();
    const component = <ListPeopleComponent
      people={this.people}
      onAddPersonClicked={this.loadCreatePerson}
      onEditPersonClicked={this.loadEditPerson}
      onDeletePersonClicked={this.loadDeletePerson}
    ></ListPeopleComponent>
      ;
    UI.render(component);
  }

  private loadDeletePerson = (person: Person): void => {
    console.log(`Delete ${person.name}`);
  }

  private loadEditPerson = (person: Person): void => {
    const commitEditPerson = (person: Person) => {
      this.eventBus.publishAsync(new PersonUpdatedEvent(person))
        .then(() => this.loadPeopleListAsync())
    }
    const component = <EditPersonComponent actionName="Update"
      person={person}
      onCancel={this.cancelEditPerson}
      onValidate={commitEditPerson}
    ></EditPersonComponent>
    UI.render(component);
  }

  private cancelEditPerson = (): void => {
    this.loadPeopleListAsync().then();
  };

  public loadCreatePerson = (): void => {
    const addPerson = (person: Person) => {
      this.eventBus.publishAsync(new PersonCreatedEvent(person))
        .then(() => this.loadPeopleListAsync());
    }
    const person: Person = { name: "", id: GUID.newGuid() }
    const component = <EditPersonComponent actionName="Create"
      onCancel={this.cancelEditPerson}
      onValidate={addPerson}
      person={person}
    >
    </EditPersonComponent>;
    UI.render(component);
  }
}