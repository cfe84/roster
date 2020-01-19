import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";
import { PeriodId } from "../period";
import { EvaluationCriteriaId } from "../evaluationCriteria";

export const EntityType = "evaluation"

export type EvaluationId = string;

export class Evaluation implements IEntity {
  id: string = GUID.newGuid();
  title: EvaluationId = "";
  details: string = "";
  date: Date = new Date();
  rate: number = 0;
  rateName: string = "";

  constructor(public periodId: PeriodId, public criteriaId: EvaluationCriteriaId) {
    this.date = new Date();
  }

  toString = () => this.title;
}