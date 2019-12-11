import { Note, NoteEditorComponent } from ".";
import { GUID } from "../utils/guid";
import { PersonId } from "../persons";
import { UIElement, UIContainer, Component } from "../html";
import { INotesStore } from "./INotesStore";
import { NotesList, NotesListComponent } from "./NotesListComponent";
import { NoteEditor } from "./NoteEditorComponent";
import { EventBus } from "../events";
import { NoteCreatedEvent } from "./NoteCreatedEvent";
import { NoteUpdatedEvent } from "./NoteUpdatedEvent";
import { NoteReaderComponent, NoteReader } from "./NoteReaderComponent";

export interface NotesControllerDependencies {
  uiContainer: UIContainer,
  db: INotesStore,
  eventBus: EventBus
}

export type notesFilter = (note: Note) => boolean;

export class NotesController {
  constructor(private deps: NotesControllerDependencies) { }

  public getNotesListAsync = async (personId: string): Promise<NotesListComponent> => {
    const notes = (await this.deps.db.getNotesAsync())
      .filter((note) => note.personId === personId)
      .sort((a, b) => a.title.localeCompare(b.title));
    const component = <NotesList
      notes={notes}
      onAddNoteClicked={() => this.displayNewNote(personId)}
      onEditNoteClicked={(note: Note) => { this.displayEditNote(note) }}
      onNoteClicked={(note: Note) => { this.displayNoteReader(note) }}
    ></NotesList>
      ;
    return component;
  }

  public displayNewNote(personId: PersonId): void {
    const addNote = (note: Note) => {
      this.deps.eventBus.publishAsync(new NoteCreatedEvent(note))
        .then(() => this.deps.uiContainer.unmountCurrent());
    }
    const now = new Date(Date.now());
    const note: Note = {
      title: "",
      id: GUID.newGuid(),
      typeId: "note",
      content: "",
      createdDate: now,
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

  private displayNoteReader = (note: Note): void => {
    const component: NoteReaderComponent = <NoteReader
      note={note}
      onBack={this.deps.uiContainer.unmountCurrent}
      onEdit={(note: Note) => this.displayEditNote(note)}
    ></NoteReader>
    const subscription = this.deps.eventBus.subscribe(NoteUpdatedEvent.type, (evt: NoteUpdatedEvent) => {
      component.props.note = evt.note;
      this.deps.uiContainer.rerenderIfCurrent(component);
    })
    component.ondispose = subscription.unsubscribe;
    this.deps.uiContainer.mount(component);
  }

  private displayEditNote = (note: Note, showTitle = false): void => {
    const commitEditNote = (note: Note) => {
      this.deps.eventBus.publishAsync(new NoteUpdatedEvent(note))
        .then(() => this.deps.uiContainer.unmountCurrent())
        .catch((error) => alert(error));
    }
    const component: NoteEditorComponent = <NoteEditor
      actionName="Update"
      note={note}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={commitEditNote}
    ></NoteEditor>;
    this.deps.uiContainer.mount(component);
  }

}