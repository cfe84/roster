import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { Evaluation } from ".";
import { EvaluationCreatedEvent } from "./EvaluationEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeEvaluationGenerator implements IFakeGenerator {
  constructor(private period: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    // const evaluation: Evaluation = new Evaluation(this.period.id);
    // evaluation.date = new Date();
    // evaluation.date.setDate(Math.random() * 10000 + evaluation.date.getDate());
    // evaluation.details = generateContent(2 + Math.floor(Math.random() * 8));
    // evaluation.title = generateTitle(4 + Math.floor(Math.random() * 5));
    // await eventBus.publishAsync(new EvaluationCreatedEvent(evaluation));
  }
}