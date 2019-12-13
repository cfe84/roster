import { IEvent } from "../../lib/common/events";

export interface IQueueMessage<T> {
  data: T
}

export interface IQueue<T> {
  countAsync(): Promise<number>;
  deleteAsync(message: IQueueMessage<T>): Promise<void>;
  peekAsync(): Promise<IQueueMessage<T>>;
  pushAsync(message: T): Promise<void>;
}