import { EventBus, IEvent } from "../../lib/common/events/";
import { INotesStore } from "./INotesStore";
import { NoteCreatedEvent, NoteUpdatedEvent, NoteDeletedEvent } from "./NoteEvents";

export class StoreNotesChangesReactor {
  constructor(private store: INotesStore) { }

  registerReactors(eventBus: EventBus) {
    eventBus.subscribe(NoteCreatedEvent.type, async (evt: IEvent) => {
      const event = evt as NoteCreatedEvent;
      await this.store.createNoteAsync(event.note);
    });
    eventBus.subscribe(NoteUpdatedEvent.type, async (evt: IEvent) => {
      const event = evt as NoteUpdatedEvent;
      await this.store.updateNoteAsync(event.note);
    });
    eventBus.subscribe(NoteDeletedEvent.type, async (evt: IEvent) => {
      const event = evt as NoteDeletedEvent;
      await this.store.deleteNoteAsync(event.note);
    });
  }
}