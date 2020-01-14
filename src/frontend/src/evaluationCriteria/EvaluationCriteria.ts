import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const EntityType = "evaluationCriteria"

export class Rate {
  constructor(public rate: number, public name: string, public description: string) { }
}

export class EvaluationCriteria implements IEntity {
  id: string = GUID.newGuid();
  title: string = "";
  details: string = "";
  rates: Rate[] = [];

  constructor() {
  }

  toString = () => this.title;
}