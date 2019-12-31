import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { GUID } from "../../lib/common/utils/guid";
import { pick } from "../utils/pick";
import { Deadline } from ".";
import { DeadlineCreatedEvent } from "./DeadlineEvents";
import { generateContent } from "../utils/fakeContent";

export class FakeDeadlineGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  private deadlines = ["desecration", "promotion", "torture to hell", "initiation", "redition", "assimilation"]

  private generateTitle = (): string => {
    return `${this.person.name}'s ${pick(this.deadlines)}`;
  }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() + Math.random() * (4000));
    const deadline: Deadline = {
      id: GUID.newGuid(),
      deadline: new Date(date),
      personId: this.person.id,
      notes: generateContent(2 + Math.floor(Math.random() * 8)),
      description: this.generateTitle(),
      done: false
    }

    await eventBus.publishAsync(new DeadlineCreatedEvent(deadline));
  }

}