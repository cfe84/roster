import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { NoteCreatedEvent } from "./NoteEvents";
import { GUID } from "../../lib/common/utils/guid";
import { Note } from ".";
import { pick } from "../utils/pick";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeNoteGenerator implements IFakeGenerator {
  constructor(private person: Person) { }


  async generateAsync(eventBus: EventBus): Promise<void> {
    const inCompanySince = this.person.inCompanySince?.getTime() || Date.now();
    const createdDate = Math.random() * (new Date().getTime() - inCompanySince) + inCompanySince;
    const updatedDate = Math.random() * (new Date().getTime() - createdDate) + createdDate;
    const note: Note = {
      id: GUID.newGuid(),
      createdDate: new Date(createdDate),
      lastEditDate: new Date(updatedDate),
      personId: this.person.id,
      content: generateContent(2 + Math.floor(Math.random() * 8)),
      title: generateTitle(3 + Math.floor(Math.random() * 8)),
      typeId: ""
    }

    await eventBus.publishAsync(new NoteCreatedEvent(note));
  }

}