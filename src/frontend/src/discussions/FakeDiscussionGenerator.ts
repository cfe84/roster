import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { GUID } from "../../lib/common/utils/guid";
import { pick } from "../utils/pick";
import { Discussion } from ".";
import { DiscussionCreatedEvent } from "./DiscussionEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeDiscussionGenerator implements IFakeGenerator {
  constructor(private person: Person) { }


  async generateAsync(eventBus: EventBus): Promise<void> {
    const inCompanySince = this.person.inCompanySince?.getTime() || Date.now();
    const createdDate = Math.random() * (new Date().getTime() - inCompanySince) + inCompanySince;
    const updatedDate = Math.random() * (new Date().getTime() - createdDate) + createdDate;
    const discussion: Discussion = {
      id: GUID.newGuid(),
      date: new Date(createdDate),
      personId: this.person.id,
      notes: generateContent(2 + Math.floor(Math.random() * 8)),
      preparation: generateContent(2 + Math.floor(Math.random() * 8)),
      description: generateTitle(3 + Math.floor(Math.random() * 8))
    }

    await eventBus.publishAsync(new DiscussionCreatedEvent(discussion));
  }

}