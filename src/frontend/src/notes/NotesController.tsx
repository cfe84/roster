import { Note, EditNoteComponent } from ".";
import { GUID } from "../utils/guid";
import { PersonId } from "../persons";
import { UIElement, UI } from "../html";
import { INotesStore } from "./INotesStore";
import { ListNotesComponent } from "./ListNotesComponent";
import { UIContainer } from "../html/UIContainer";

export class NotesController {
  constructor(private uiContainer: UIContainer, private db: INotesStore) { }
  loadNewNote(personId: PersonId, callback: () => void): void {
    // const addPerson = (person: Person) => {
    //   this.eventBus.publishAsync(new PersonCreatedEvent(person))
    //     .then(() => this.loadPeopleListAsync());
    // }
    const addNote = (note: Note) => {
      callback();
    }
    const now = new Date(Date.now());
    const note: Note = {
      title: "",
      id: GUID.newGuid(),
      typeId: "note",
      content: "",
      date: now,
      lastEditDate: now,
      personId: personId
    }
    const component = <EditNoteComponent
      actionName="Create"
      note={note}
      onCancel={callback}
      onValidate={addNote}
    >
    </EditNoteComponent>;
    this.uiContainer.mount(component);
  }

  getNotesListAsync = async (personId: PersonId): Promise<UIElement> => {
    const notes = await this.db.getNotesAsync();
    const component = <ListNotesComponent
      notes={notes}
      onAddNoteClicked={() => this.loadNewNote(personId, () => { })}
      onEditNoteClicked={() => { }}
      onNoteClicked={() => { }}
    ></ListNotesComponent>
      ;
    return component;
  }
}