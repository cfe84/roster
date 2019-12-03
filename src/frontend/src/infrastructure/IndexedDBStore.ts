import { IPersonStore, Person } from "../persons";
import { resolve } from "dns";

const DB_NAME: string = "rosterdb";
const DB_VERSION: number = 1;
const OBJECTSTORE_PEOPLE: string = "people";

const getTarget = <T>(evt: any): T => (evt.target as T)

type transactionType = "readwrite" | "readonly";

class AsyncIndexedDB {
  private constructor(private db: IDBDatabase) { }

  static OpenDbAsync = (dbName: string,
    dbVersion: number,
    upgradeCallback: ((db: IDBDatabase) => void)): Promise<AsyncIndexedDB> =>
    new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(Error("Browser does not support IndexedDB"));
      }
      const openRequest = window.indexedDB.open(dbName, dbVersion);
      openRequest.onupgradeneeded = evt => upgradeCallback(getTarget<IDBOpenDBRequest>(evt).result);
      openRequest.onsuccess = (evt) => {
        resolve(new AsyncIndexedDB(getTarget<IDBOpenDBRequest>(evt).result))
      };
      openRequest.onerror = (evt) => {
        reject(getTarget<IDBOpenDBRequest>(evt).error);
      }
    });

  private createDbTransaction(storeName: string, mode: transactionType = "readonly") {
    const transaction = this.db.transaction(storeName, mode);
    const objectStore = transaction.objectStore(storeName);
    return objectStore;
  }

  private static addEventHandlersToRequest<T>(
    request: IDBRequest<T>,
    successHandler: ((request: IDBRequest<T>) => void),
    failureHandler: ((request: IDBRequest<T>) => void)) {
    request.onsuccess = (event: Event) => successHandler(event.target as IDBRequest);
    request.onerror = (event: Event) => failureHandler(event.target as IDBRequest);
  }

  public getAllAsync = <T>(storeName: string): Promise<T[]> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName);
      const request = objectStore.getAll();
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<T[]>) => resolve(request.result),
        (request: IDBRequest<T[]>) => reject(request.error));
    });

  public getEntityAsync = <T>(storeName: string, key: string): Promise<T> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName);
      const request = objectStore.get(key);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<T>) => resolve(request.result),
        (request: IDBRequest<T>) => reject(request.error));
    });

  public createEntityAsync = <T>(storeName: string, entity: T): Promise<void> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName, "readwrite");
      const request = objectStore.add(entity);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<IDBValidKey>) => resolve(),
        (request: IDBRequest<IDBValidKey>) => reject(request.error));
    });

  public putEntityAsync = <T>(storeName: string, entity: T): Promise<T[]> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName, "readwrite");
      const request = objectStore.put(entity);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<IDBValidKey>) => resolve(),
        (request: IDBRequest<IDBValidKey>) => reject(request.error));
    });
}

export class IndexedDBStore implements IPersonStore {

  private static createObjectStore(db: IDBDatabase) {
    console.log(`Creating db in version ${DB_VERSION}`);
    const peopleObjectStore = db.createObjectStore(OBJECTSTORE_PEOPLE, {
      keyPath: "id"
    });
    peopleObjectStore.createIndex("name", name, { unique: false });
  }

  static OpenDbAsync = async (): Promise<IndexedDBStore> => {
    const db = await AsyncIndexedDB.OpenDbAsync(DB_NAME, DB_VERSION, IndexedDBStore.createObjectStore);
    return new IndexedDBStore(db);
  }

  private constructor(private db: AsyncIndexedDB) {
  }

  public getPeopleAsync = async (): Promise<Person[]> =>
    (await this.db.getAllAsync<Person>(OBJECTSTORE_PEOPLE))
      .sort((a, b) => a.name.localeCompare(b.name));


  public createPersonAsync = async (person: Person): Promise<void> => {
    await this.db.createEntityAsync(OBJECTSTORE_PEOPLE, person);
  }

  public updatePersonAsync = async (person: Person): Promise<void> => {
    await this.db.putEntityAsync(OBJECTSTORE_PEOPLE, person);
  }
}