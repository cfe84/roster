import { Action } from "./Action";
import { IStore } from "../storage/IStore";

export interface IActionStore {
  getActionsAsync(): Promise<Action[]>;
  createActionAsync(element: Action): Promise<void>;
  updateActionAsync(element: Action): Promise<void>;
  deleteActionAsync(element: Action): Promise<void>;
}

export class ActionStoreAdapter implements IStore<Action> {
  constructor(private store: IActionStore) { }
  getAsync = this.store.getActionsAsync;
  createAsync = this.store.createActionAsync;
  updateAsync = this.store.deleteActionAsync;
}