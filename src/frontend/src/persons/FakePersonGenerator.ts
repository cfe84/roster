import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person, PersonCreatedEvent } from ".";
import { GUID } from "../../lib/common/utils/guid";
import { pick } from "../utils/pick";
import { FakeNoteGenerator } from "../notes/FakeNoteGenerator";
import { FakeDiscussionGenerator } from "../discussions/FakeDiscussionGenerator";
import { FakeDeadlineGenerator } from "../deadlines/FakeDeadlineGenerator";
import { FakeActionGenerator } from "../actions/FakeActionGenerator";
import { FakePeriodGenerator } from "../period/FakePeriodGenerator";


export class FakePersonGenerator implements IFakeGenerator {

  private consonnants = ["q", "w", "r", "t", "p", "s", "d", "f", "g", "h", "j", "k", "l", "m", "n", "b", "v", "c", "x", "z"]
  private vowels = ["a", "e", "i", "o", "u", "y", "an", "en", "oi", "oy", "oo", "oe", "ee", "ui"];
  private endConsonnants = ["x", "z", "x", "q", "x", "r", "r", "k", "g"];

  private surname = ["magnificent", "terrible", "butcher", "sorcerer", "awful", "maleficent", "disrupter", "destroyer"]
  private surnameAction = ["ruler", "dominator", "transformer", "butcher", "primer", "derelicter", "king", "destroyer", "queen"]
  private surnameQualifier = ["heart", "people", "humans", "purity", "bugs", "devils", "renegades", "worlds"]

  private seniority = ["senior ", "junior ", "", "principal ", "grand master ", "master ", "intern ", "king ", "prince ",]
  private title = ["torturer", "executioner", "punisher", "finger puller", "hair firer"]

  private generateSurname = (): string => (Math.random() > .6) ? ` the ${pick(this.surname)}` : `, ${pick(this.surnameAction)} of ${pick(this.surnameQualifier)}`;
  private generateFirstname = (): string => `${pick(this.consonnants).toUpperCase()}${pick(this.vowels)}${pick(this.consonnants)}${pick(this.consonnants)}${pick(this.vowels)}${pick(this.endConsonnants)}`
  private generateName = (): string => this.generateFirstname() + this.generateSurname();
  private generatePosition = (): string => `${pick(this.seniority)}${pick(this.title)}`

  async generateAsync(eventBus: EventBus): Promise<void> {
    const inCompanySince = Math.random() * new Date().getTime();
    const inPositionSince = Math.random() * (new Date().getTime() - inCompanySince) + inCompanySince;
    const inTeamSince = Math.random() * (new Date().getTime() - inCompanySince) + inCompanySince;

    const person: Person = {
      id: GUID.newGuid(),
      name: this.generateName(),
      position: this.generatePosition(),
      role: pick(this.title),
      inCompanySince: new Date(inCompanySince),
      inPositionSince: new Date(inPositionSince),
      inTeamSince: new Date(inTeamSince)
    };

    await eventBus.publishAsync(new PersonCreatedEvent(person));

    const notes = Math.random() * 15;
    const fakeNotesGenerator = new FakeNoteGenerator(person);
    for (let i = 0; i < notes; i++) {
      await fakeNotesGenerator.generateAsync(eventBus);
    }

    const discussions = Math.random() * 15;
    const fakeDiscussionGenerator = new FakeDiscussionGenerator(person);
    for (let i = 0; i < discussions; i++) {
      await fakeDiscussionGenerator.generateAsync(eventBus);
    }

    const deadlines = Math.random() * 2;
    const fakeDeadlineGenerator = new FakeDeadlineGenerator(person);
    for (let i = 0; i < deadlines; i++) {
      await fakeDeadlineGenerator.generateAsync(eventBus);
    }

    const actions = Math.random() * 5;
    const fakeActionGenerator = new FakeActionGenerator(person);
    for (let i = 0; i < actions; i++) {
      await fakeActionGenerator.generateAsync(eventBus);
    }

    const periods = Math.random() * 4;
    const fakePeriodGenerator = new FakePeriodGenerator(person);
    for (let i = 0; i < periods; i++) {
      await fakePeriodGenerator.generateAsync(eventBus);
    }
  }

}