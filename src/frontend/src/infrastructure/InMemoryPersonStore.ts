import { IPersonStore, Person } from "../persons";

export class InMemoryPersonStore implements IPersonStore {

  private people: Person[] = [];

  public getPeopleAsync = async () =>
    this.people;
  public createPersonAsync = async (person: Person) => {
    this.people.push(person);
  }
  public updatePersonAsync = async (person: Person) => {
    const existingPersonIndex = this.people.findIndex((p) => p.id === person.id);
    if (existingPersonIndex < 0) {
      throw Error(`Person not found: ${person.id}`);
    }
    this.people[existingPersonIndex] = person;
  }
}