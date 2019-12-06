import { PersonController } from "./persons";
import { NotesController } from "./notes";

export interface Controllers {
  people: PersonController,
  notes: NotesController
}