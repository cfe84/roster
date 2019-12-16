import { MemoryStorageProvider } from "./MemoryStorageProvider";
import { TableStorageProvider } from "./TableStorageProvider";

export class StorageFactory {
  static getStorageProvider() {
    const storageConnectionString = process.env["STORAGE_CONNECTION_STRING"];
    if (storageConnectionString) {
      return new TableStorageProvider(storageConnectionString);
    }
    return new MemoryStorageProvider();
  }
}