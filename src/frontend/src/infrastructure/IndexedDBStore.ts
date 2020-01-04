import { Person } from "../persons";
import { Note } from "../notes";
import { Discussion } from "../discussions";
import { Deadline } from "../deadlines";
import { IWholeStore } from "../storage/IWholeStore";
import { Action } from "../actions";
import { objectUtils } from "../utils/objectUtils";

const DB_NAME: string = "rosterdb";
const DB_VERSION: number = 6;
const OBJECTSTORE_PEOPLE: string = "people";
const OBJECTSTORE_NOTES: string = "notes";
const OBJECTSTORE_DISCUSSIONS: string = "discussions";
const OBJECTSTORE_DEADLINES: string = "deadlines";
const OBJECTSTORE_ACTIONS: string = "actions";

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
      entity = objectUtils.clone(entity, true);
      const objectStore = this.createDbTransaction(storeName, "readwrite");
      const request = objectStore.add(entity);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<IDBValidKey>) => resolve(),
        (request: IDBRequest<IDBValidKey>) => reject(request.error));
    });

  public putEntityAsync = <T>(storeName: string, entity: T): Promise<T[]> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName, "readwrite");
      entity = objectUtils.clone(entity, true);
      const request = objectStore.put(entity);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<IDBValidKey>) => resolve(),
        (request: IDBRequest<IDBValidKey>) => reject(request.error));
    });

  public deleteEntityAsync = (storeName: string, entityId: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const objectStore = this.createDbTransaction(storeName, "readwrite");
      const request = objectStore.delete(entityId);
      AsyncIndexedDB.addEventHandlersToRequest(request,
        (request: IDBRequest<undefined>) => resolve(),
        (request: IDBRequest<undefined>) => reject(request.error));
    });
}

export class IndexedDBStore implements IWholeStore {


  private static createObjectStore(db: IDBDatabase, storeName: string, parameters: IDBObjectStoreParameters): IDBObjectStore | null {
    const storeAlreadyExists = db.objectStoreNames.contains(storeName)
    if (storeAlreadyExists) {
      return null;
    } else {
      const store = db.createObjectStore(storeName, parameters);
      return store;
    }
  }
  private static updateDatabase(db: IDBDatabase) {
    console.log(`Creating db in version ${DB_VERSION}`);
    const stores = [
      { name: OBJECTSTORE_PEOPLE, key: "id", index: "name" },
      { name: OBJECTSTORE_NOTES, key: "id", index: "personid" },
      { name: OBJECTSTORE_DISCUSSIONS, key: "id", index: "personid" },
      { name: OBJECTSTORE_DEADLINES, key: "id", index: "personid" },
      { name: OBJECTSTORE_ACTIONS, key: "id", index: "personid" },
    ];
    stores.forEach((storeInfo) => {
      const store = IndexedDBStore.createObjectStore(db, storeInfo.name, { keyPath: storeInfo.key });
      if (store)
        store.createIndex(storeInfo.index, storeInfo.index, { unique: false });
    });
  }

  static OpenDbAsync = async (): Promise<IndexedDBStore> => {
    const db = await AsyncIndexedDB.OpenDbAsync(DB_NAME, DB_VERSION, IndexedDBStore.updateDatabase);
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
  public deletePersonAsync = async (person: Person): Promise<void> => {
    await this.db.deleteEntityAsync(OBJECTSTORE_PEOPLE, person.id);
  }

  public getNotesAsync = async (): Promise<Note[]> =>
    (await this.db.getAllAsync<Note>(OBJECTSTORE_NOTES))
      .sort((a, b) => (a.title.localeCompare(b.title)));


  public createNoteAsync = async (note: Note): Promise<void> => {
    await this.db.createEntityAsync(OBJECTSTORE_NOTES, note);
  }

  public updateNoteAsync = async (note: Note): Promise<void> => {
    await this.db.putEntityAsync(OBJECTSTORE_NOTES, note);
  }

  public deleteNoteAsync = async (note: Note): Promise<void> => {
    await this.db.deleteEntityAsync(OBJECTSTORE_NOTES, note.id);
  }

  public getDiscussionsAsync = async (): Promise<Discussion[]> =>
    (await this.db.getAllAsync<Discussion>(OBJECTSTORE_DISCUSSIONS))
      .sort((a, b) => ((a.date && b.date && a.date.getTime && b.date.getTime && a.date.getTime() < b.date.getTime()) ? 1 : -1));

  public createDiscussionAsync = async (element: Discussion): Promise<void> => {
    await this.db.createEntityAsync(OBJECTSTORE_DISCUSSIONS, element);
  }
  public updateDiscussionAsync = async (element: Discussion): Promise<void> => {
    await this.db.putEntityAsync(OBJECTSTORE_DISCUSSIONS, element);
  }
  public deleteDiscussionAsync = async (element: Discussion): Promise<void> => {
    await this.db.deleteEntityAsync(OBJECTSTORE_DISCUSSIONS, element.id);
  }

  public getDeadlinesAsync = async (): Promise<Deadline[]> =>
    (await this.db.getAllAsync<Deadline>(OBJECTSTORE_DEADLINES))
      .sort((a, b) => (a.deadline && b.deadline && a.deadline.getTime() < b.deadline.getTime() ? 1 : -1))

  public createDeadlineAsync = async (element: Deadline): Promise<void> => {
    await this.db.createEntityAsync(OBJECTSTORE_DEADLINES, element);
  }
  public updateDeadlineAsync = async (element: Deadline): Promise<void> => {
    await this.db.putEntityAsync(OBJECTSTORE_DEADLINES, element);
  }
  public deleteDeadlineAsync = async (element: Deadline): Promise<void> => {
    await this.db.deleteEntityAsync(OBJECTSTORE_DEADLINES, element.id);
  }

  public getActionsAsync = async (): Promise<Action[]> =>
    (await this.db.getAllAsync<Action>(OBJECTSTORE_ACTIONS));

  public createActionAsync = async (element: Action): Promise<void> => {
    await this.db.createEntityAsync(OBJECTSTORE_ACTIONS, element);
  }
  public updateActionAsync = async (element: Action): Promise<void> => {
    await this.db.putEntityAsync(OBJECTSTORE_ACTIONS, element);
  }
  public deleteActionAsync = async (element: Action): Promise<void> => {
    await this.db.deleteEntityAsync(OBJECTSTORE_ACTIONS, element.id);
  }
}