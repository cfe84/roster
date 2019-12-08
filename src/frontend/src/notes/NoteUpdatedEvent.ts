import { IEvent } from "../events";
import { Note } from "./Note";
import { EventInfo } from "../events/EventInfo";

export class NoteUpdatedEvent implements IEvent {
  static type: string = "noteUpdatedEvent";
  info = new EventInfo(NoteUpdatedEvent.type);
  constructor(public note: Note) { }

}