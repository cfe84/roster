import { Deadline } from ".";

export interface IDeadlineStore {
  getDeadlinesAsync(): Promise<Deadline[]>;
  createDeadlineAsync(element: Deadline): Promise<void>;
  updateDeadlineAsync(element: Deadline): Promise<void>;
  deleteDeadlineAsync(element: Deadline): Promise<void>;
}