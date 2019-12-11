import { PersonId } from "../persons";

export type NoteId = string;

export interface Note {
  typeId: string,
  personId: PersonId,
  createdDate: Date,
  id: NoteId,
  title: string,
  lastEditDate: Date,
  content: string
}