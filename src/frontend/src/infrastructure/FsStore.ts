import { Person } from "../persons";
import { Note } from "../notes";
import { Discussion } from "../discussions";
import { Deadline } from "../deadlines";
import { IWholeStore } from "../storage/IWholeStore";
import { promises as fsAsync, default as fs } from "fs";
import { Action } from "../actions";
import { Period } from "../period";

class MyArray<T> {
  [index: string]: T
}

class Db {
  persons = new MyArray<Person>();
  notes = new MyArray<Note>();
  discussions = new MyArray<Discussion>();
  deadlines = new MyArray<Deadline>();
  actions = new MyArray<Action>();
  periods = new MyArray<Period>();
  toString(): string {
    return JSON.stringify(this);
  }
  public static deserialize(serializedStore: string): Db {
    const deserializedDb = JSON.parse(serializedStore) as Db;
    Object.setPrototypeOf(deserializedDb, new Db());
    return deserializedDb;
  }
}

type KeyFinder<T> = (entity: T) => string;

class ArrayManager<T> {
  constructor(private array: MyArray<T>, private keyFinder: KeyFinder<T>, private store: FsStore) { }
  addAsync = async (entity: T) => {
    const key: string = this.keyFinder(entity);
    if (this.array[key] === undefined) {
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
    let db: Db;
    const fileExists = fs.existsSync(file);
    if (fileExists) {
      const serializedJson = (await fsAsync.readFile(file)).toString();
      db = Db.deserialize(serializedJson);
    } else {
      db = new Db();
    }
    return new FsStore(file, db);
  }

  persons: ArrayManager<Person>;
  notes: ArrayManager<Note>;
  discussions: ArrayManager<Discussion>;
  deadlines: ArrayManager<Deadline>;
  actions: ArrayManager<Action>;
  periods: ArrayManager<Period>;

  private constructor(private file: string, private db: Db) {
    this.persons = new ArrayManager(db.persons, (person: Person) => person.id, this);
    this.notes = new ArrayManager(db.notes, (note: Note) => note.id, this);
    this.discussions = new ArrayManager(db.discussions, (discussion: Discussion) => discussion.id, this);
    this.deadlines = new ArrayManager(db.deadlines, (deadline: Deadline) => deadline.id, this);
    this.actions = new ArrayManager(db.actions, (action: Action) => action.id, this);
    this.periods = new ArrayManager(db.periods, (period: Period) => period.id, this);
  }

  commitChangesAsync = async () => {
    const serialized = this.db.toString();
    await fsAsync.writeFile(this.file, serialized);
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

  getActionsAsync = (): Promise<Action[]> => this.actions.getAsync()
  createActionAsync = (action: Action): Promise<void> => this.actions.addAsync(action);
  updateActionAsync = (action: Action): Promise<void> => this.actions.updateAsync(action);
  deleteActionAsync = (action: Action): Promise<void> => this.actions.deleteAsync(action);

  getPeriodsAsync = (): Promise<Period[]> => this.periods.getAsync()
  createPeriodAsync = (period: Period): Promise<void> => this.periods.addAsync(period);
  updatePeriodAsync = (period: Period): Promise<void> => this.periods.updateAsync(period);
  deletePeriodAsync = (period: Period): Promise<void> => this.periods.deleteAsync(period);
}
