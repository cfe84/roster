import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { Observation } from ".";
import { ObservationCreatedEvent } from "./ObservationEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeObservationGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const observation: Observation = new Observation(this.person.id);
    observation.date = new Date();
    observation.date.setDate(Math.random() * 10000 + observation.date.getDate());
    observation.details = generateContent(2 + Math.floor(Math.random() * 8));
    observation.title = generateTitle(4 + Math.floor(Math.random() * 5));
    await eventBus.publishAsync(new ObservationCreatedEvent(observation));
  }
}