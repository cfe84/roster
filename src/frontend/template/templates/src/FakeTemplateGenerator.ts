import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { Template } from ".";
import { TemplateCreatedEvent } from "./TemplateEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeTemplateGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const template: Template = new Template(this.person.id);
    template.date = new Date();
    template.date.setDate(Math.random() * 10000 + template.date.getDate());
    template.details = generateContent(2 + Math.floor(Math.random() * 8));
    template.title = generateTitle(4 + Math.floor(Math.random() * 5));
    await eventBus.publishAsync(new TemplateCreatedEvent(template));
  }
}