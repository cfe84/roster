import { Note, NoteEditorComponent } from ".";
import { GUID } from "../../lib/common/utils/guid";
import { PersonId } from "../persons";
import { UIElement, UIContainer, Component } from "../html";
import { INotesStore } from "./INotesStore";
import { NotesList, NotesListComponent } from "./NotesListComponent";
import { NoteEditor } from "./NoteEditorComponent";
import { EventBus } from "../../lib/common/events/";
import { NoteCreatedEvent } from "./NoteCreatedEvent";
import { NoteUpdatedEvent } from "./NoteUpdatedEvent";
import { NoteReaderComponent, NoteReader } from "./NoteReaderComponent";
import { ConfirmationDialogComponent, ConfirmationDialog } from "../baseComponents/ConfirmationDialog";
import { NoteDeletedEvent } from "./NoteDeletedEvent";
import { List } from "../baseComponents/ListComponent";

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
    const list = <List
      title="Notes"
      titleIcon="sticky-note"
      elements={notes}
      elementDisplay={(note) => new UIElement("TEXT", { text: note.title })}
      onAddClicked={() => this.displayNewNote(personId)}
      onClicked={(note: Note) => { this.displayNoteReader(note) }}
      onEditClicked={this.displayEditNote}
    ></List>
    return list;
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
      onEdit={this.displayEditNote}
      onDelete={() => this.displayDeleteNote(note)}
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

  private displayDeleteNote = (note: Note): void => {
    const deleteNote = () => {
      this.deps.eventBus.publishAsync(new NoteDeletedEvent(note)).then(() => this.deps.uiContainer.unmountCurrent())

    }
    const component = <ConfirmationDialog
      oncancel={this.deps.uiContainer.unmountCurrent}
      onyes={deleteNote}
      text={`Are you sure you want to delete note "${note.title}"?`}
      title="Confirm note deletion" />
    this.deps.uiContainer.mount(component);
  }

}