import { IEvent } from "../events";
import { Note } from "./Note";
import { EventInfo } from "../events/EventInfo";

export class NoteDeletedEvent implements IEvent {
  static type: string = "noteDeletedEvent";
  info = new EventInfo(NoteDeletedEvent.type);
  constructor(public note: Note) { }

}