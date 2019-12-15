import { IEvent } from "../../lib/common/events";
import { Note, NoteType as NoteObjectType } from "./Note";
import { EventInfo } from "../../lib/common/events/EventInfo";

export class NoteCreatedEvent implements IEvent {
  static type: string = "noteCreatedEvent";
  info = new EventInfo(NoteCreatedEvent.type, NoteObjectType, this.note.id);
  constructor(public note: Note) { }
}

export class NoteUpdatedEvent implements IEvent {
  static type: string = "noteUpdatedEvent";
  info = new EventInfo(NoteUpdatedEvent.type, NoteObjectType, this.note.id);
  constructor(public note: Note) { }
}

export class NoteDeletedEvent implements IEvent {
  static type: string = "noteDeletedEvent";
  info = new EventInfo(NoteDeletedEvent.type, NoteObjectType, this.note.id);
  constructor(public note: Note) { }
}