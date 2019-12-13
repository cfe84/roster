import { IEvent } from "../../lib/common/events/";
import { Note } from "./Note";
import { EventInfo } from "../../lib/common/events//EventInfo";

export class NoteUpdatedEvent implements IEvent {
  static type: string = "noteUpdatedEvent";
  info = new EventInfo(NoteUpdatedEvent.type);
  constructor(public note: Note) { }

}