import { Action } from "./Action";

export interface IActionStore {
  getActionsAsync(): Promise<Action[]>;
  createActionAsync(element: Action): Promise<void>;
  updateActionAsync(element: Action): Promise<void>;
  deleteActionAsync(element: Action): Promise<void>;
}