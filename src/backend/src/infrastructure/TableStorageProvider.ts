import { IStorageProvider } from "../Storage/IStorageProvider";
import { IAccountEventStore } from "../Storage/IAccountEventStore";
import { TableService } from "azure-storage";
import { TableStorageEventStore } from "./TableStorageEventStore";

const USERTABLE_PREFIX = "account";
const cleanTableName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");

export class TableStorageProvider implements IStorageProvider {
  tableService: TableService;

  constructor(connectionString: string) {
    this.tableService = new TableService(connectionString);
  }

  createTableIfNotExistAsync = (tableName: string): Promise<void> => new Promise((resolve: any, reject: any) =>
    this.tableService.createTableIfNotExists(tableName, {}, (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (!result) {
          console.log(`Created table ${tableName}`)
        }
        resolve();
      }
    })
  );

  async getAccountEventStoreAsync(accountId: string): Promise<IAccountEventStore> {
    const tableName = cleanTableName(`${USERTABLE_PREFIX}${accountId}`);
    await this.createTableIfNotExistAsync(tableName);
    return new TableStorageEventStore(this.tableService, tableName);
  }
}