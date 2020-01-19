import { Person } from "../persons";
import { Note } from "../notes";
import { Discussion } from "../discussions";
import { Deadline } from "../deadlines";
import { IWholeStore } from "../storage/IWholeStore";
import { promises as fsAsync, default as fs } from "fs";
import { Action } from "../actions";
import { Period } from "../period";
import { EvaluationCriteria } from "../evaluationCriteria";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";
import { Observation } from "../observation";
import { Evaluation } from "../evaluation";
import { GUID } from "../../lib/common/utils/guid";

class MyArray<T> {
  [index: string]: T
}

class Db {
  static version = 7;
  version = Db.version;
  persons = new MyArray<Person>();
  notes = new MyArray<Note>();
  discussions = new MyArray<Discussion>();
  deadlines = new MyArray<Deadline>();
  actions = new MyArray<Action>();
  periods = new MyArray<Period>();
  evaluationCriterias = new MyArray<EvaluationCriteria>();
  observations = new MyArray<Observation>();
  evaluations = new MyArray<Evaluation>();

  private static migrateToV3 = (store: Db) => {
    if (store.version < 3) {
      console.log(`Upgrading db to version 3`);
      if (!store.evaluationCriterias) {
        store.evaluationCriterias = new MyArray<EvaluationCriteria>();
      }
      if (!store.periods) {
        store.periods = new MyArray<Period>();
      }
      store.version = 3
    }
  }

  private static migrateToV4 = (store: Db) => {
    if (store.version < 4) {
      console.log(`Upgrading db to version 4`);
      const keys = Object.keys(store.evaluationCriterias);
      keys.forEach((key: string) => {
        if (store.evaluationCriterias[key].active === undefined) {
          store.evaluationCriterias[key].active = true;
        }
      })
    }
  }

  private static migrateToV5 = (store: Db) => {
    if (store.version < 5) {
      console.log(`Upgrading db to version 5`);
      if (!store.observations) {
        store.observations = new MyArray<Observation>();
      }
      store.version = 5;
    }
  }

  private static migrateToV6 = (store: Db) => {
    if (store.version < 6) {
      console.log(`Upgrading db to version 6`);
      if (!store.evaluations) {
        store.evaluations = new MyArray<Evaluation>();
      }
      store.version = 6;
    }
  }

  private static migrateToV7 = (store: Db) => {
    if (store.version < 7) {
      console.log(`Upgrading db to version 7`);
      const keys = Object.getOwnPropertyNames(store.evaluationCriterias)
        .forEach((key: string) => {
          const criteria = store.evaluationCriterias[key];
          criteria.rates.forEach((rate) => {
            const order = (rate as any).rate;
            delete (rate as any).rate;
            rate.order = order;
            rate.id = GUID.newGuid();
          })
        })
      store.version = 7;
    }
  }

  public static migrate = (store: Db) => {
    if (!store.version) {
      store.version = 1;
    }
    Db.migrateToV3(store);
    Db.migrateToV4(store);
    Db.migrateToV5(store);
    Db.migrateToV6(store);
    Db.migrateToV7(store);
  }

  public static deserialize(serializedStore: string): Db {
    const deserializedStore = JsonSerializer.deserialize(serializedStore) as Db;
    Db.migrate(deserializedStore);
    return deserializedStore;
  }
  public static serialize = (store: Db): string => {
    return JSON.stringify(store);
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
  evaluationCriterias: ArrayManager<EvaluationCriteria>;
  observations: ArrayManager<Observation>;
  evaluations: ArrayManager<Evaluation>;

  private constructor(private file: string, private db: Db) {
    this.persons = new ArrayManager(db.persons, (person: Person) => person.id, this);
    this.notes = new ArrayManager(db.notes, (note: Note) => note.id, this);
    this.discussions = new ArrayManager(db.discussions, (discussion: Discussion) => discussion.id, this);
    this.deadlines = new ArrayManager(db.deadlines, (deadline: Deadline) => deadline.id, this);
    this.actions = new ArrayManager(db.actions, (action: Action) => action.id, this);
    this.periods = new ArrayManager(db.periods, (period: Period) => period.id, this);
    this.evaluationCriterias = new ArrayManager(db.evaluationCriterias, (evaluationCriteria: EvaluationCriteria) => evaluationCriteria.id, this);
    this.observations = new ArrayManager(db.observations, (observation: Observation) => observation.id, this);
    this.evaluations = new ArrayManager(db.evaluations, (evaluation: Evaluation) => evaluation.id, this);
  }

  commitChangesAsync = async () => {
    const serialized = Db.serialize(this.db);
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

  getEvaluationCriteriasAsync = (): Promise<EvaluationCriteria[]> => this.evaluationCriterias.getAsync()
  createEvaluationCriteriaAsync = (evaluationCriteria: EvaluationCriteria): Promise<void> => this.evaluationCriterias.addAsync(evaluationCriteria);
  updateEvaluationCriteriaAsync = (evaluationCriteria: EvaluationCriteria): Promise<void> => this.evaluationCriterias.updateAsync(evaluationCriteria);
  deleteEvaluationCriteriaAsync = (evaluationCriteria: EvaluationCriteria): Promise<void> => this.evaluationCriterias.deleteAsync(evaluationCriteria);

  getObservationsAsync = (): Promise<Observation[]> => this.observations.getAsync()
  createObservationAsync = (observation: Observation): Promise<void> => this.observations.addAsync(observation);
  updateObservationAsync = (observation: Observation): Promise<void> => this.observations.updateAsync(observation);
  deleteObservationAsync = (observation: Observation): Promise<void> => this.observations.deleteAsync(observation);

  getEvaluationsAsync = (): Promise<Evaluation[]> => this.evaluations.getAsync()
  createEvaluationAsync = (evaluation: Evaluation): Promise<void> => this.evaluations.addAsync(evaluation);
  updateEvaluationAsync = (evaluation: Evaluation): Promise<void> => this.evaluations.updateAsync(evaluation);
  deleteEvaluationAsync = (evaluation: Evaluation): Promise<void> => this.evaluations.deleteAsync(evaluation);

}
