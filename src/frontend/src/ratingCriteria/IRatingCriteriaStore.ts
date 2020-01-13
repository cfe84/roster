import { RatingCriteria } from "./RatingCriteria";
import { IStore } from "../storage/IStore";

export interface IRatingCriteriaStore {
  getRatingCriteriasAsync(): Promise<RatingCriteria[]>;
  createRatingCriteriaAsync(element: RatingCriteria): Promise<void>;
  updateRatingCriteriaAsync(element: RatingCriteria): Promise<void>;
  deleteRatingCriteriaAsync(element: RatingCriteria): Promise<void>;
}

export class RatingCriteriaStoreAdapter implements IStore<RatingCriteria> {
  constructor(private store: IRatingCriteriaStore) { }
  getAsync = this.store.getRatingCriteriasAsync;
  createAsync = this.store.createRatingCriteriaAsync;
  updateAsync = this.store.deleteRatingCriteriaAsync;
}