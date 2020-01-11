import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const EntityType = "period"

export class Period implements IEntity {
  id: string = GUID.newGuid();
  name: string = "";
  details: string = "";
  startDate: Date = new Date();
  finishDate: Date = new Date();

  constructor(public personId: string) {
  }

  toString = () => this.name;
}