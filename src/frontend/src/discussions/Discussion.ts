import { PersonId } from "../persons";

export const DiscussionObjectType = "discussion";

export interface Discussion {
  id: string,
  personId: PersonId,
  date: Date,
  description: string,
  preparation: string,
  notes: string
}