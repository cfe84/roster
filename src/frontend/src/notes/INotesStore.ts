import { Note } from "./Note";

export interface INotesStore {
  getNotesAsync(): Promise<Note[]>;
  createNoteAsync(note: Note): Promise<void>;
  updateNoteAsync(note: Note): Promise<void>;
}