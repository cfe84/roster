import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const ActionType = "action"

export type ActionResponsibilityType = "theirs" | "mine";

export class Action implements IEntity {
  id: string = GUID.newGuid();
  summary: string = "";
  details: string = "";
  createdDate: Date = new Date();
  dueDate: Date;
  done: boolean = false;
  responsibility: ActionResponsibilityType = "theirs";

  constructor(public personId: string) {
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + 7);
  }
}