import { Person } from "./Person";

export interface IPersonStore {
  getPeopleAsync(): Promise<Person[]>;
  createPersonAsync(person: Person): Promise<void>;
  updatePersonAsync(person: Person): Promise<void>;
}