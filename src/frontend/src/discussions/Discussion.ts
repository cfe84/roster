import { NoteId } from "../notes/Note";
import { PersonId } from "../persons";

export interface Discussion {
  id: string,
  personId: PersonId,
  date: Date,
  description: string,
  preparation: string,
  notes: string
}