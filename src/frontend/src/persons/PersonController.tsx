import { PersonEditor, PersonList, IPersonStore, PersonOverview } from "./index";
import { UIContainer, Component, UIElement } from "../html";
import { EventBus } from "../../lib/common/events/";
import { PersonCreatedEvent, PersonUpdatedEvent, PersonDeletedEvent } from "./PersonEvent";
import { Person } from "./Person";
import { GUID } from "../../lib/common/utils/guid"
import { NotesController } from "../notes";
import { PersonListComponent } from "./PersonListComponent";
import { PersonEditorComponent } from "./PersonEditorComponent";
import { PersonOverviewComponent } from "./PersonOverviewComponent";
import { DiscussionController } from "../discussions";
import { ConfirmationDialog } from "../baseComponents/ConfirmationDialog";
import { DeadlineController } from "../deadlines";

export interface PersonControllerDeps {
  eventBus: EventBus, uiContainer: UIContainer,
  db: IPersonStore, notesController: NotesController, discussionController: DiscussionController,
  deadlineController: DeadlineController
}

export class PersonController {
  constructor(private deps: PersonControllerDeps) { }

  rootComponent?: PersonListComponent;

  public loadPeopleListAsync = async (): Promise<PersonListComponent> => {
    const people = await this.deps.db.getPeopleAsync();
    const component: PersonListComponent = <PersonList
      people={people}
      onPersonClicked={this.displayPersonOverview}
      onAddPersonClicked={this.displayCreatePerson}
      onEditPersonClicked={this.displayEditPerson}
    ></PersonList>;

    const reload = async () => {
      const people = await this.deps.db.getPeopleAsync();
      component.props.people = people;
      this.deps.uiContainer.rerenderIfCurrent(component);
    }

    const subscription1 = this.deps.eventBus.subscribe(PersonCreatedEvent.type, async (evt: PersonCreatedEvent) => { await reload(); });
    const subscription2 = this.deps.eventBus.subscribe(PersonUpdatedEvent.type, async (evt: PersonUpdatedEvent) => { await reload(); });
    component.ondispose = () => {
      this.deps.eventBus.unsubscribe(subscription1);
      this.deps.eventBus.unsubscribe(subscription2);
    }
    this.rootComponent = component;
    return component;
  }

  private displayPersonOverview = (person: Person): void => {
    const component: PersonOverviewComponent = <PersonOverview
      person={person}
      notesController={this.deps.notesController}
      discussionController={this.deps.discussionController}
      deadlineController={this.deps.deadlineController}
      onEditClicked={this.displayEditPerson}
      onExitClicked={this.deps.uiContainer.unmountCurrent}
    ></PersonOverview>;
    const subscription = this.deps.eventBus.subscribe(PersonUpdatedEvent.type, (evt: PersonUpdatedEvent) => {
      if (evt.person.id === person.id) {
        component.props.person = evt.person;
        this.deps.uiContainer.rerenderIfCurrent(component);
      }
    })
    component.ondispose = () => this.deps.eventBus.unsubscribe(subscription);
    this.deps.uiContainer.mount(component);
  }

  private displayEditPerson = (person: Person): void => {
    const commitEditPerson = (person: Person) => {
      this.deps.eventBus.publishAsync(new PersonUpdatedEvent(person))
        .then(() => this.deps.uiContainer.unmountCurrent())
    }
    const component: PersonEditorComponent = <PersonEditor actionName="Update"
      person={person}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={commitEditPerson}
      onDelete={() => this.displayDeletePerson(person)}
    ></PersonEditor>;
    this.deps.uiContainer.mount(component);
  }

  public displayCreatePerson = (): void => {
    const addPerson = (person: Person) => {
      this.deps.eventBus.publishAsync(new PersonCreatedEvent(person))
        .then(() => this.deps.uiContainer.unmountCurrent());
    }
    const person: Person = { name: "", id: GUID.newGuid(), inCompanySince: undefined, inPositionSince: undefined, inTeamSince: undefined, position: "", role: "" }
    const component = <PersonEditor actionName="Create"
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={addPerson}
      person={person}
    > </PersonEditor>;
    this.deps.uiContainer.mount(component);
  }

  private displayDeletePerson = (person: Person): void => {
    const deletePerson = () => {
      this.deps.eventBus.publishAsync(new PersonDeletedEvent(person)).then(() => {
        this.deps.uiContainer.unmountCurrent()
      })
    }
    const component = <ConfirmationDialog
      oncancel={this.deps.uiContainer.unmountCurrent}
      onyes={deletePerson}
      text={`Are you sure you want to delete "${person.name}"?`}
      title={`Confirm deletion of ${person.name}`} />
    this.deps.uiContainer.mount(component);
  }
}