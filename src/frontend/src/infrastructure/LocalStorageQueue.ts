import { IQueue, IQueueMessage } from "../synchronization/IQueue";
import { IEvent } from "../../lib/common/events";

export interface ILocalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class LocalStorageQueueMessage<T> implements IQueueMessage<T> {
  constructor(public data: T,
    public index: number) { }
}

const NEXT_MESSAGE_INDEX = "queue.nextMessage";
const LAST_MESSAGE_INDEX = "queue.lastMessage";
const MESSAGE_KEY_ROOT = "queue.message";
const EMPTY = "EMPTY";

export class LocalStorageQueue<T> implements IQueue<T> {
  constructor(private storage: ILocalStorage = localStorage) { }

  countAsync = async (): Promise<number> => {
    const nextIndex = this.storage.getItem(NEXT_MESSAGE_INDEX);
    const lastIndex = this.storage.getItem(LAST_MESSAGE_INDEX);
    if (!nextIndex || !lastIndex || this.queueIsEmpty()) return 0;
    return parseInt(lastIndex) - parseInt(nextIndex) + 1;
  }

  private getIndexForNextMessageAsync = async (): Promise<number> =>
    parseInt(this.storage.getItem(NEXT_MESSAGE_INDEX) || "");
  private setIndexForNextMessageAsync = async (index: number): Promise<void> => {
    this.storage.setItem(NEXT_MESSAGE_INDEX, index.toString());
  }

  private getIndexForLastMessageAsync = async (): Promise<number> =>
    parseInt(this.storage.getItem(LAST_MESSAGE_INDEX) || "");
  private setIndexForLastMessageAsync = async (index: number): Promise<void> =>
    this.storage.setItem(LAST_MESSAGE_INDEX, index.toString());

  private queueIsEmpty = (): boolean => {
    const nextMessageIndex = this.storage.getItem(NEXT_MESSAGE_INDEX);
    return !nextMessageIndex || nextMessageIndex === EMPTY;
  }
  private setQueueToEmpty = () =>
    this.storage.setItem(NEXT_MESSAGE_INDEX, EMPTY);

  private makeKey = (index: number) => `${MESSAGE_KEY_ROOT}-${index}`

  deleteAsync = async (message: IQueueMessage<T>): Promise<void> => {
    const lsMessage = message as LocalStorageQueueMessage<T>;
    const thisMessageIndex = await this.getIndexForNextMessageAsync();
    if (await this.countAsync() === 1) {
      this.setQueueToEmpty();
    } else {
      this.setIndexForNextMessageAsync(thisMessageIndex + 1);
    }
    const thisMessageKey = this.makeKey(thisMessageIndex);
    this.storage.removeItem(thisMessageKey);
  }

  peekAsync = async (): Promise<IQueueMessage<T>> => {
    const count = await this.countAsync();
    if (count === 0) {
      throw Error("Trying to peek while queue is empty");
    }
    const messageIndex = await this.getIndexForNextMessageAsync();
    const messageKey = this.makeKey(messageIndex);
    const serializedMessage = this.storage.getItem(messageKey);
    if (serializedMessage === null) {
      throw Error("Message is null, this shouldn't happen");
    }
    return JSON.parse(serializedMessage);
  }

  pushAsync = async (message: T): Promise<void> => {
    let messageIndex: number;
    if (this.queueIsEmpty()) {
      messageIndex = 1;
      await this.setIndexForNextMessageAsync(messageIndex);
    } else {
      messageIndex = await this.getIndexForLastMessageAsync() + 1;
    }
    await this.setIndexForLastMessageAsync(messageIndex);
    const messageKey = this.makeKey(messageIndex);
    const serializedMessage = JSON.stringify(message);
    this.storage.setItem(messageKey, serializedMessage);
  }
}