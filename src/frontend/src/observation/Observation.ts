import { IEntity } from "../../lib/common/entities"
import { GUID } from "../../lib/common/utils/guid";
import { EvaluationCriteriaId } from "../evaluationCriteria";
import { PeriodId } from "../period";

export const EntityType = "observation"
export type ObservationId = string;

export class Observation implements IEntity {
  id: ObservationId = GUID.newGuid();
  details: string = "";
  title: string = "";
  date: Date = new Date();
  observedCriteriaIds: EvaluationCriteriaId[] = []

  constructor(public periodId: PeriodId) {
    this.date = new Date();
  }

  toString = () => this.details;
}