import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";
import { PeriodId } from "../period";
import { EvaluationCriteriaId } from "../evaluationCriteria";
import { RateId } from "../evaluationCriteria/EvaluationCriteria";

export const EntityType = "evaluation"

export type EvaluationId = string;

export class Evaluation implements IEntity {
  id: EvaluationId = GUID.newGuid();
  details: string = "";
  date: Date = new Date();
  rateId: RateId = "";
  rateName: string = "";

  constructor(public periodId: PeriodId, public criteriaId: EvaluationCriteriaId, public criteriaName: string) {
    this.date = new Date();
  }

  toString = () => this.criteriaName;
}