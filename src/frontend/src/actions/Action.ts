export const ActionType = "action"

export type ActionResponsibilityType = "theirs" | "mine";

export interface Action {
  id: string,
  name: string,
  details: string,
  createdDate: Date,
  dueDate: Date,
  done: boolean,
  personId: string,
  responsibility: ActionResponsibilityType
}