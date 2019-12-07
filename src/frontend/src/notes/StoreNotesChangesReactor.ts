import { EventBus, IEvent } from "../events";
import { INotesStore } from "./INotesStore";
import { NoteCreatedEvent } from "./NoteCreatedEvent";
import { NoteUpdatedEvent } from "./NoteUpdatedEvent";

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
  }
}