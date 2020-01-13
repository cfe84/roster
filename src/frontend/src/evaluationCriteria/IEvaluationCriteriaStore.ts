import { EvaluationCriteria } from "./EvaluationCriteria";
import { IStore } from "../storage/IStore";

export interface IEvaluationCriteriaStore {
  getEvaluationCriteriasAsync(): Promise<EvaluationCriteria[]>;
  createEvaluationCriteriaAsync(element: EvaluationCriteria): Promise<void>;
  updateEvaluationCriteriaAsync(element: EvaluationCriteria): Promise<void>;
  deleteEvaluationCriteriaAsync(element: EvaluationCriteria): Promise<void>;
}

export class EvaluationCriteriaStoreAdapter implements IStore<EvaluationCriteria> {
  constructor(private store: IEvaluationCriteriaStore) { }
  getAsync = this.store.getEvaluationCriteriasAsync;
  createAsync = this.store.createEvaluationCriteriaAsync;
  updateAsync = this.store.deleteEvaluationCriteriaAsync;
}