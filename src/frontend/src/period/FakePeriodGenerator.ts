import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { Period } from ".";
import { PeriodCreatedEvent } from "./PeriodEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";
import { FakeObservationGenerator } from "../observation/FakeObservationGenerator";

export class FakePeriodGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const period: Period = new Period(this.person.id);
    period.startDate = new Date();
    period.finishDate = new Date();
    period.startDate.setDate(Math.random() * 10000 + period.startDate.getDate());
    period.finishDate.setDate(period.startDate.getDate() + 90);
    period.details = generateContent(2 + Math.floor(Math.random() * 3));
    period.name = generateTitle(4 + Math.floor(Math.random() * 5));
    await eventBus.publishAsync(new PeriodCreatedEvent(period));

    const observations = Math.random() * 8 + 2;
    const fakeObservationGenerator = new FakeObservationGenerator(period);
    for (let i = 0; i < observations; i++) {
      await fakeObservationGenerator.generateAsync(eventBus);
    }
  }
}