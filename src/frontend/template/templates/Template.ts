import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const EntityType = "template"

export class Template implements IEntity {
  id: string = GUID.newGuid();
  title: string = "";
  details: string = "";
  date: Date = new Date();

  constructor(public personId: string) {
    this.date = new Date();
  }

  toString = () => this.title;
}