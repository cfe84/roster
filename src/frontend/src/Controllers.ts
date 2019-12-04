import { PeopleController } from "./persons";
import { NotesController } from "./notes";

export interface Controllers {
  people: PeopleController,
  notes: NotesController
}