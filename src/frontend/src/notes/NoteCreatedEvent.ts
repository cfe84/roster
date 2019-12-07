import { IEvent } from "../events";
import { Note } from "./Note";

export class NoteCreatedEvent implements IEvent {
  static type: string = "noteCreatedEvent";
  type: string = NoteCreatedEvent.type;

  constructor(public note: Note) { }

}