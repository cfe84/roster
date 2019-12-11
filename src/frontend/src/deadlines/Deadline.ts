import { PersonId } from "../persons";

export interface Deadline {
  deadline: Date;
  description: string;
  notes: string;
  done: boolean;
  personId: PersonId;
  id: string;
}