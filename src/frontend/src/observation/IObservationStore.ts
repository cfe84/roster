import { Observation } from "./Observation";
import { IStore } from "../storage/IStore";

export interface IObservationStore {
  getObservationsAsync(): Promise<Observation[]>;
  createObservationAsync(element: Observation): Promise<void>;
  updateObservationAsync(element: Observation): Promise<void>;
  deleteObservationAsync(element: Observation): Promise<void>;
}

export class ObservationStoreAdapter implements IStore<Observation> {
  constructor(private store: IObservationStore) { }
  getAsync = this.store.getObservationsAsync;
  createAsync = this.store.createObservationAsync;
  updateAsync = this.store.deleteObservationAsync;
}