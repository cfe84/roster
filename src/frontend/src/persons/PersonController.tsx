import { EditPerson, PersonList, IPersonStore, PersonOverview } from "./index";
import { UIContainer, Component, UIElement } from "../html";
import { EventBus } from "../events";
import { PersonCreatedEvent } from "./PersonCreatedEvent";
import { Person } from "./Person";
import { PersonUpdatedEvent } from "./PersonUpdatedEvent";
import { GUID } from "../utils/guid"
import { NotesController } from "../notes";
import { PersonListComponent } from "./PersonListComponent";

export class PersonController {
  constructor(private eventBus: EventBus, private uiContainer: UIContainer, private peopleStore: IPersonStore, private notesController: NotesController) {
  }

  public loadPeopleListAsync = async (): Promise<void> => {

    const people = await this.peopleStore.getPeopleAsync();
    const component: PersonListComponent = <PersonList
      people={people}
      onPersonClicked={this.loadPersonOverview}
      onAddPersonClicked={this.loadCreatePerson}
      onEditPersonClicked={this.loadEditPerson}
    ></PersonList>;
    this.uiContainer.mount(component);

    const reload = async () => {
      const people = await this.peopleStore.getPeopleAsync();
      component.props.people = people;
      this.uiContainer.rerenderIfCurrent(component);
    }

    this.eventBus.subscribe(PersonCreatedEvent.type, async (evt: PersonCreatedEvent) => { await reload(); });
    this.eventBus.subscribe(PersonUpdatedEvent.type, async (evt: PersonUpdatedEvent) => { await reload(); });
  }

  private loadPersonOverview = (person: Person): void => {
    const component = <PersonOverview
      person={person}
      onNewNoteClicked={() => this.notesController.loadNewNote(person.id, () => this.loadPersonOverview(person))}
      onEditPersonClicked={() => this.loadEditPerson(person)}
      onExitClicked={this.uiContainer.unmountCurrent}
    ></PersonOverview>;
    this.uiContainer.mount(component);
  }

  private loadEditPerson = (person: Person): void => {
    const commitEditPerson = (person: Person) => {
      this.eventBus.publishAsync(new PersonUpdatedEvent(person))
        .then(() => this.uiContainer.unmountCurrent())
    }
    const component = <EditPerson actionName="Update"
      person={person}
      onCancel={this.uiContainer.unmountCurrent}
      onValidate={commitEditPerson}
    ></EditPerson>
    this.uiContainer.mount(component);
  }

  private loadPeopleList = (): void => {
    this.loadPeopleListAsync().then();
  };

  public loadCreatePerson = (): void => {
    const addPerson = (person: Person) => {
      this.eventBus.publishAsync(new PersonCreatedEvent(person))
        .then(() => this.uiContainer.unmountCurrent());
    }
    const person: Person = { name: "", id: GUID.newGuid() }
    const component = <EditPerson actionName="Create"
      onCancel={this.uiContainer.unmountCurrent}
      onValidate={addPerson}
      person={person}
    >
    </EditPerson>;
    this.uiContainer.mount(component);
  }
}