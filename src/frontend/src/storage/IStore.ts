export interface IStore<T> {
  getAsync(): Promise<T[]>;
  createAsync(element: T): Promise<void>;
  updateAsync(element: T): Promise<void>;
}