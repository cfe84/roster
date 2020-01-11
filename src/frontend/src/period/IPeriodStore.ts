import { Period } from "./Period";
import { IStore } from "../storage/IStore";

export interface IPeriodStore {
  getPeriodsAsync(): Promise<Period[]>;
  createPeriodAsync(element: Period): Promise<void>;
  updatePeriodAsync(element: Period): Promise<void>;
  deletePeriodAsync(element: Period): Promise<void>;
}

export class PeriodStoreAdapter implements IStore<Period> {
  constructor(private store: IPeriodStore) { }
  getAsync = this.store.getPeriodsAsync;
  createAsync = this.store.createPeriodAsync;
  updateAsync = this.store.deletePeriodAsync;
}