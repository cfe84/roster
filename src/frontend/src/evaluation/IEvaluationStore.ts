import { Evaluation } from "./Evaluation";
import { IStore } from "../storage/IStore";

export interface IEvaluationStore {
  getEvaluationsAsync(): Promise<Evaluation[]>;
  createEvaluationAsync(element: Evaluation): Promise<void>;
  updateEvaluationAsync(element: Evaluation): Promise<void>;
  deleteEvaluationAsync(element: Evaluation): Promise<void>;
}

export class EvaluationStoreAdapter implements IStore<Evaluation> {
  constructor(private store: IEvaluationStore) { }
  getAsync = this.store.getEvaluationsAsync;
  createAsync = this.store.createEvaluationAsync;
  updateAsync = this.store.deleteEvaluationAsync;
}