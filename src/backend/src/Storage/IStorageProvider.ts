import { IAccountEventStore } from "./IAccountEventStore";

export interface IStorageProvider {
  getAccountEventStoreAsync(accountId: string): Promise<IAccountEventStore>;
}