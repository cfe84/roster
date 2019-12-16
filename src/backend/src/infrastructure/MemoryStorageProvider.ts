import { IStorageProvider } from "../Storage/IStorageProvider";
import { IAccountEventStore } from "../Storage/IAccountEventStore";
import { MemoryEventStore } from "./InMemoryEventStore";

export class MemoryStorageProvider implements IStorageProvider {
  accounts: {
    [key: string]: IAccountEventStore
  } = {};
  async getAccountEventStoreAsync(accountId: string): Promise<IAccountEventStore> {
    if (!this.accounts[accountId]) {
      this.accounts[accountId] = new MemoryEventStore();
    }
    return this.accounts[accountId];
  }

}