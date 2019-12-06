import { EditPersonComponent, PersonListComponent, IPersonStore, PersonOverviewComponent } from "./index";
import { UIContainer } from "../html/UIContainer";
import { UIElement } from "../html";
import { EventBus } from "../events";
import { PersonCreatedEvent } from "./PersonCreatedEvent";
import { Person } from "./Person";
import { PersonUpdatedEvent } from "./PersonUpdatedEvent";
import { GUID } from "../utils/guid"
import { NotesController } from "../notes";

export class PersonController {
  constructor(private eventBus: EventBus, private uiContainer: UIContainer, private peopleStore: IPersonStore, private notesController: NotesController) {
  }



  public loadPeopleListAsync = async (): Promise<void> => {
    const people = await this.peopleStore.getPeopleAsync();
    const component = <PersonListComponent
      people={people}
      onPersonClicked={this.loadPersonOverview}
      onAddPersonClicked={this.loadCreatePerson}
      onEditPersonClicked={this.loadEditPerson}
    ></PersonListComponent>;
    this.uiContainer.mount(component);
  }

  private loadPersonOverview = (person: Person): void => {
    const component = <PersonOverviewComponent
      person={person}
      onNewNoteClicked={() => this.notesController.loadNewNote(person.id, () => this.loadPersonOverview(person))}
      onEditPersonClicked={() => this.loadEditPerson(person)}
      onExitClicked={this.loadPeopleList}
    ></PersonOverviewComponent>;
    this.uiContainer.mount(component);
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
      onCancel={this.loadPeopleList}
      onValidate={commitEditPerson}
    ></EditPersonComponent>
    this.uiContainer.mount(component);
  }

  private loadPeopleList = (): void => {
    this.loadPeopleListAsync().then();
  };

  public loadCreatePerson = (): void => {
    const addPerson = (person: Person) => {
      this.eventBus.publishAsync(new PersonCreatedEvent(person))
        .then(() => this.loadPeopleListAsync());
    }
    const person: Person = { name: "", id: GUID.newGuid() }
    const component = <EditPersonComponent actionName="Create"
      onCancel={this.loadPeopleList}
      onValidate={addPerson}
      person={person}
    >
    </EditPersonComponent>;
    this.uiContainer.mount(component);
  }
}