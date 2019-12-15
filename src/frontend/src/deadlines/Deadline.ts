import { PersonId } from "../persons";

export const DeadlineObjectType = "deadline"

export interface Deadline {
  deadline: Date;
  description: string;
  notes: string;
  done: boolean;
  personId: PersonId;
  id: string;
}