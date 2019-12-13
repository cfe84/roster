import { IEvent } from "../../lib/common/events/";
import { Note } from "./Note";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class NoteCreatedEvent implements IEvent {
  static type: string = "noteCreatedEvent";
  info = new EventInfo(NoteCreatedEvent.type);
  constructor(public note: Note) { }

}