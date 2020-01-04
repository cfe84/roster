import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { Action } from ".";
import { ActionCreatedEvent } from "./ActionEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeActionGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const action: Action = new Action(this.person.id);
    action.dueDate.setDate(Math.random() * 10000 + action.dueDate.getDate());
    action.details = generateContent(2 + Math.floor(Math.random() * 8));
    action.completed = Math.random() > .5;
    action.summary = generateTitle(4 + Math.floor(Math.random() * 5));
    action.responsibility = Math.random() > .6 ? "mine" : "theirs";
    await eventBus.publishAsync(new ActionCreatedEvent(action));
  }
}