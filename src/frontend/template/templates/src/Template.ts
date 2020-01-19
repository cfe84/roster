import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const EntityType = "template"

export type TemplateId = string;

export class Template implements IEntity {
  id: string = GUID.newGuid();
  title: TemplateId = "";
  details: string = "";
  date: Date = new Date();

  constructor(public personId: string) {
    this.date = new Date();
  }

  toString = () => this.title;
}