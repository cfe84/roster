import { Note, NoteEditorComponent } from ".";
import { GUID } from "../utils/guid";
import { PersonId } from "../persons";
import { UIElement, UIContainer, Component } from "../html";
import { INotesStore } from "./INotesStore";
import { NotesList, NotesListComponent } from "./NotesListComponent";
import { NoteEditor } from "./NoteEditorComponent";
import { EventBus } from "../events";

export interface NotesControllerDependencies {
  uiContainer: UIContainer,
  db: INotesStore,
  eventBus: EventBus
}

export class NotesController {
  constructor(private deps: NotesControllerDependencies) { }
  loadNewNote(personId: PersonId): void {
    const addNote = (note: Note) => {

      this.deps.uiContainer.unmountCurrent();
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
    const component = <NoteEditor
      actionName="Create"
      note={note}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={addNote}
    >
    </NoteEditor>;
    this.deps.uiContainer.mount(component);
  }

  getNotesListAsync = async (personId: PersonId): Promise<NotesListComponent> => {
    const notes = await this.deps.db.getNotesAsync();
    const component = <NotesList
      notes={notes}
      onAddNoteClicked={() => this.loadNewNote(personId)}
      onEditNoteClicked={() => { }}
      onNoteClicked={() => { }}
    ></NotesList>
      ;
    return component;
  }
}