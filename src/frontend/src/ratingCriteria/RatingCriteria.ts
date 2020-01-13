import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";

export const EntityType = "ratingCriteria"

export class CriteriaRate {
  constructor(public rate: number, public name: string, public description: string) { }
}

export class RatingCriteria implements IEntity {
  id: string = GUID.newGuid();
  title: string = "";
  details: string = "";
  rates: CriteriaRate[] = [];

  constructor() {
  }

  toString = () => this.title;
}