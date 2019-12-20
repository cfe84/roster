import { Person } from "../persons";
import { Note } from "../notes";
import { Discussion } from "../discussions";
import { Deadline } from "../deadlines";
import { IWholeStore } from "./IWholeStore";
import { promises as fsAsync, default as fs } from "fs";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";


class MyArray<T> {
  [index: string]: T
}

class Db {
  persons = new MyArray<Person>();
  notes = new MyArray<Note>();
  discussions = new MyArray<Discussion>();
  deadlines = new MyArray<Deadline>();
  toString(): string {
    return JsonSerializer.serialize(this);
  }
  public static deserialize(serializedStore: string): Db {
    const deserializedDb = JsonSerializer.deserialize(serializedStore) as Db;
    Object.setPrototypeOf(deserializedDb, new Db());
    return deserializedDb;
  }
}

type KeyFinder<T> = (entity: T) => string;

class ArrayManager<T> {
  constructor(private array: MyArray<T>, private keyFinder: KeyFinder<T>, private store: FsStore) { }
  addAsync = async (entity: T) => {
    const key: string = this.keyFinder(entity);
    if (this.array[key] !== undefined) {
      this.array[key] = entity;
      await this.store.commitChangesAsync();
    } else {
      throw Error("Duplicate entry");
    }
  }

  updateAsync = async (entity: T) => {
    const key: string = this.keyFinder(entity);
    this.array[key] = entity;
    await this.store.commitChangesAsync();
  }

  getAsync = async (): Promise<T[]> => {
    return Object.entries(this.array).map((entry) => entry[1]);
  }

  deleteAsync = async (entity: T) => {
    const key: string = this.keyFinder(entity);
    if (this.array[key] !== undefined) {
      delete this.array[key];
      await this.store.commitChangesAsync();
    } else {
      throw Error("Entry doesn't exist");
    }
  }
}

export class FsStore implements IWholeStore {

  public static async loadAsync(file: string): Promise<FsStore> {
    let handle: fsAsync.FileHandle;
    let db: Db;
    const fileExists = fs.existsSync(file);
    if (fileExists) {
      handle = await fsAsync.open(file, "rw");
      const serializedJson = await fsAsync.readFile(handle).toString();
      db = Db.deserialize(serializedJson);
    } else {
      handle = await fsAsync.open(file, "rw");
      db = new Db();
    }
    return new FsStore(handle, db);
  }

  persons: ArrayManager<Person>;
  notes: ArrayManager<Note>;
  discussions: ArrayManager<Discussion>;
  deadlines: ArrayManager<Deadline>;

  private constructor(private handle: fsAsync.FileHandle, private db: Db) {
    this.persons = new ArrayManager(db.persons, (person: Person) => person.id, this);
    this.notes = new ArrayManager(db.notes, (note: Note) => note.id, this);
    this.discussions = new ArrayManager(db.discussions, (discussion: Discussion) => discussion.id, this);
    this.deadlines = new ArrayManager(db.deadlines, (deadline: Deadline) => deadline.id, this);
  }

  commitChangesAsync = async () => {
    const serialized = this.db.toString();
    await fsAsync.write(this.handle, serialized);
  }

  getPeopleAsync = (): Promise<Person[]> => this.persons.getAsync()
  createPersonAsync = (person: Person): Promise<void> => this.persons.addAsync(person);
  updatePersonAsync = (person: Person): Promise<void> => this.persons.updateAsync(person);
  deletePersonAsync = (person: Person): Promise<void> => this.persons.deleteAsync(person);


  getNotesAsync = (): Promise<Note[]> => this.notes.getAsync()
  createNoteAsync = (note: Note): Promise<void> => this.notes.addAsync(note);
  updateNoteAsync = (note: Note): Promise<void> => this.notes.updateAsync(note);
  deleteNoteAsync = (note: Note): Promise<void> => this.notes.deleteAsync(note);
  getDiscussionsAsync = (): Promise<Discussion[]> => this.discussions.getAsync()
  createDiscussionAsync = (discussion: Discussion): Promise<void> => this.discussions.addAsync(discussion);
  updateDiscussionAsync = (discussion: Discussion): Promise<void> => this.discussions.updateAsync(discussion);
  deleteDiscussionAsync = (discussion: Discussion): Promise<void> => this.discussions.deleteAsync(discussion);
  getDeadlinesAsync = (): Promise<Deadline[]> => this.deadlines.getAsync()
  createDeadlineAsync = (deadline: Deadline): Promise<void> => this.deadlines.addAsync(deadline);
  updateDeadlineAsync = (deadline: Deadline): Promise<void> => this.deadlines.updateAsync(deadline);
  deleteDeadlineAsync = (deadline: Deadline): Promise<void> => this.deadlines.deleteAsync(deadline);
}