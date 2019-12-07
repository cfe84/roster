import { IEvent } from "../events";
import { Note } from "./Note";

export class NoteUpdatedEvent implements IEvent {
  static type: string = "noteUpdatedEvent";
  type: string = NoteUpdatedEvent.type;

  constructor(public note: Note) { }

}